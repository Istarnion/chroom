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

function replaceUrl(message) {
    //var urlRegex = "(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})";
    var urlRegex = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return message.replace(urlRegex, "<a href='$1' target='_blank'>$1</a>");
}

ws_server.on('connection', (connection) => {
    connectionID++;
    console.log('Opened a connection, id: '+connectionID);
    var json = {numberOfCon: ws_server.clients.length};
    json = JSON.stringify(json);
    for (var i = 0; i < ws_server.clients.length; i++) {
        ws_server.clients[i].send(json);
    }
    // sending chatlog to new connection
    var rl = readline.createInterface({
        input: fs.createReadStream('chatlog.txt')
    });

    rl.on('line', function(line) {
        if(!line) return;
        var json = JSON.parse(line);
        json = JSON.stringify(
            {
                name:json.name,
                msg:json.msg,
                timestamp:json.timestamp
            }
        );
        connection.send(json);
    });

    // new incomming message
    connection.on('message', (message) => {
        var json = JSON.parse(message);
        if(json.msg.length > 500) {
            console.log('over 500');
            json = JSON.stringify(
                {
                    name: "SERVER",
                    msg: escape(json.name)+", please stop trying to spam the chat. No messages over 500 chars are allowed.",
                    timestamp: escape(json.timestamp)
                }
            )
        }
        else {

            var message = escape(json.msg);

            json = JSON.stringify(
                {
                    name:escape(json.name),
                    msg:replaceUrl(message),
                    timestamp:escape(json.timestamp)
                }
            );
        }

        fs.appendFile('chatlog.txt', '\n'+json, function (err) {
            if (err) return console.log(err);
        });

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

var server = http_server.listen(4241, () => {
    var host = server.address().address;
    if (host == '::') {
        host = 'localhost';
    }
    var port = server.address().port;
    console.log('Running and listening at http://%s:%s', host, port);
});
