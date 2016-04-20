"use strict";

function stringFormat(text, length, left) {
    var padding = "";
    for (var i=0; i<(length-text.length); i++) {
        padding += " ";
    }

    if (left) {
        return (padding + text);
    }
    else {
        return (text + padding);
    }
}

function getDateString() {
    function toDoubleDigit(str) {
        var s = ""+str;
        if (s.length < 2) return "0"+s;
        return s;
    }

    var d = new Date();
    return d.getFullYear()+"-"+toDoubleDigit(d.getMonth()+1)+"-"+toDoubleDigit(d.getDate())+" "+
        toDoubleDigit(d.getHours())+":"+toDoubleDigit(d.getMinutes())+":"+toDoubleDigit(d.getSeconds());
}

$(function() {
    var namefield = $("#nameInput");
    var msgfield = $("#msgInput");
    var chatwindow = $("#chatwindow");

    var nick = window.localStorage.getItem("nick");
    if (nick) {
        namefield.val(nick);
    }
    else {
        namefield.val("Anon");
    }

    var host = location.host;
    var n = host.indexOf(":");
    if (n > -1) {
        host = host.substr(0, n);
    }
    console.log(host);
    var ws = new WebSocket("ws://"+host+":4242");

    ws.onerror = (msg) => {
        console.log(msg);
        $("#connection_label").html("Not connected");
    };

    ws.onopen = function() {
        $("#connection_label").html("Connected");
      };

    ws.onmessage = function(event) {
        var json = JSON.parse(event.data);

        // set number of connections
        if(json.numberOfCon) {
            var numberOfCon = $("#numberOfCon");
            console.log(json.numberOfCon);
            numberOfCon.html(json.numberOfCon);
        } else {
            var chatarea = $("#chatarea");
            var str =
            '<span class="timestamp chat">'+"["+json.timestamp + "] </span>"+
            '<span class="name chat">'+stringFormat("&lt;"+  json.name + "&gt;", 16, false)+'</span>'+
            '<span class="message chat">'+json.msg+'</span>';
            chatarea.html(chatarea.html() + "<br>"+str);
            chatarea.scrollTop(chatarea[0].scrollHeight);
          }
      };

    function sendMsg() {

      if(!namefield.val()) {
         // Error
      }
      else {
        window.localStorage.setItem("nick", namefield.val());

        if(msgfield.val()) {
          var datestring = getDateString();
          var json = {name: namefield.val(), msg: msgfield.val(), timestamp: datestring};
          ws.send(JSON.stringify(json));
          $("#msgInput").val("");
        }
      }
    }

    $("#submit-button").click(function() {
        sendMsg();
    });

    $("#msgInput").keyup(function(event) {
        if (event.keyCode === 13) {  // Enter
          sendMsg();
        }
    })
});
