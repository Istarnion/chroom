'use strict';

var express = require('express');
var ws = require('ws');

var http_server = express();

var ws_server = new ws.Server({port:4242});

http_server.use(express.static(__dirname + "/../client"));

ws_server.on('connection', (connection) => {
  console.log('Opened a connection');

  connection.on('message', (message) => {
    console.log("message: "+message);

    for(var c=0;c<ws_server.clients.length;c++) {
      ws_server.clients[c].send(message);
    }
  });

  connection.on('close', () => {
    console.log("Closed a connection");
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
