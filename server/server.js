'use strict';

var express = require('express');
var ws = require('ws');
var escape = require('escape-html')
var connectionID = 0;
var fs = require('fs');
var http_server = express();
var ws_server = new ws.Server({port:4242});
var readline = require('readline');

http_server.use(express.static(__dirname + "/../client"));

ws_server.on('connection', (connection) => {
    connectionID++;
    console.log('Opened a connection, id: '+connectionID);

    // sending chatlog to new connection
    var rl = readline.createInterface({
        input: fs.createReadStream('chatlog.txt')
    });

    rl.on('line', function(line) {
        if(!line) return;
        var json = JSON.parse(line);
        json = JSON.stringify(
            {
                name:escape(json.name),
                msg:escape(json.msg),
                timestamp:escape(json.timestamp)
            }
        );
        connection.send(json);
    });

    // new incomming message
    connection.on('message', (message) => {
        if(message.length > 500) {
            console.log('over 500');
            return;
        }
        fs.appendFile('chatlog.txt', '\n'+message, function (err) {
            if (err) return console.log(err);
        });

        var json = JSON.parse(message);
        json = JSON.stringify(
            {
                name:escape(json.name),
                msg:escape(json.msg),
                timestamp:escape(json.timestamp)
            }
        );
        // send message to all clients
        for(var c=0;c<ws_server.clients.length;c++) {
            ws_server.clients[c].send(json);
        }
    });

    connection.on('close', () => {
        console.log("Closed a connection, id: "+connectionID);
        connectionID--;
    });

    connection.on('error', (error) => {
        console.error("Error: "+error.message);
    });
});

// Let node get a random port from the OS so we won't have issues with crashes
var server = http_server.listen(4241, () => {
    var host = server.address().address;
    if (host == '::') {
        host = 'localhost';
    }
    var port = server.address().port;
    console.log('Running and listening at http://%s:%s', host, port);
});
