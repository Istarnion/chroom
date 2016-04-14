"use strict";

$(function() {
  var chatwindow = $("#chatwindow");
  var ws = new WebSocket("ws://158.38.55.16:4242");

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
    + "\n["+json.timestamp + "] <"+  json.name + "> " + json.msg);

    chatwindow.scrollTop(chatwindow[0].scrollHeight);

  };

  
  $("#submit-button").click(() => {
    var namefield = $("#nameInput");
    var msgfield = $("#inputDefault");
    if(!namefield.val()) {
    }
    else {
      if(msgfield.val()) {
        var d = new Date().toISOString();
        var datestring = d.getYear()+"-"+d.getMonth()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
        var json = {"name": namefield.val(), "msg": msgfield.val(), "timestamp": datestring};
        ws.send(JSON.stringify(json));
      }
    }
  });
});

