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

    console.log("TEST: "+toDoubleDigit("2"));
    console.log("TEST: "+toDoubleDigit("22"));
    console.log("TEST: "+toDoubleDigit(""));

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
    var json = JSON.parse(event.data);
    chatwindow.val(chatwindow.val()
    + "\n["+json.timestamp + "] "+stringFormat("<"+  json.name + ">", 16, false) + json.msg);

    chatwindow.scrollTop(chatwindow[0].scrollHeight);

  };

  function sendMsg() {
    var namefield = $("#nameInput");
    var msgfield = $("#inputDefault");
    if(!namefield.val()) {
    }
    else {
      if(msgfield.val()) {
        var datestring = getDateString();
        var json = {"name": namefield.val(), "msg": msgfield.val(), "timestamp": datestring};
        ws.send(JSON.stringify(json));
      }
    }
  }
  
  $("#submit-button").click(() => {
      sendMsg();
  });

  $("#inputDefault").keyup((event) => {
      if (event.keyCode === 13) {  // Enter
        sendMsg();
        $("#inputDefault").val("");
      }
  })
});

