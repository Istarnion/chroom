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
    return d.getFullYear()+"-"+toDoubleDigit(d.getMonth())+"-"+toDoubleDigit(d.getDate())+" "+
        toDoubleDigit(d.getHours())+":"+toDoubleDigit(d.getMinutes())+":"+toDoubleDigit(d.getSeconds());
}

$(function() {
  var chatwindow = $("#chatwindow");
  var ws = new WebSocket("ws://localhost:4242");

  ws.onerror = (msg) => {
      console.log(msg);
      $("#connection_label").html("Not connected");
    };

  ws.onopen = () => {
      $("#connection_label").html("Connected");
    };

  ws.onmessage = (event) => {
    var chatarea = $("#chatarea");

    var json = JSON.parse(event.data);
    var str =
        '<span class="timestamp">'+"["+json.timestamp + "] </span>"+
        '<span class="name">'+stringFormat("&lt"+  json.name + "&gt", 16, false)+'</span>'+
        '<span class="message">'+json.msg+'</span>';

    chatarea.html(chatarea.html() + "<br>"+str);

    chatarea.scrollTop(chatarea[0].scrollHeight);

  };

  function sendMsg() {
    var namefield = $("#nameInput");
    var msgfield = $("#msgInput");
    if(!namefield.val()) {
       // Error 
    }
    else {
      if(msgfield.val()) {
        var datestring = getDateString();
        var json = {name: namefield.val(), msg: msgfield.val(), timestamp: datestring};
        ws.send(JSON.stringify(json));
        $("#msgInput").val("");
      }
    }
  }
  
  $("#submit-button").click(() => {
      sendMsg();
  });

  $("#msgInput").keyup((event) => {
      if (event.keyCode === 13) {  // Enter
        sendMsg();
      }
  })
});

