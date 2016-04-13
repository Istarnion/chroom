'use strict';

var express = require('express');
var ws = require('ws');

var http_server = express();

http_server.use(express.static(__dirname + "/../client"));


// Let node get a random port from the OS so we won't have issues with crashes
var server = http_server.listen(() => {
    var host = server.address().address;
    if (host == '::') {
        host = 'localhost';
    }
    var port = server.address().port;
    console.log('Running and listening at http://%s:%s', host, port);
});

