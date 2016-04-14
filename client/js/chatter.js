"use strict";

$(function() {

  var ws = new WebSocket("ws://localhost:4242");

  ws.onerror = (msg) => {
      console.log(msg);
      $("#connection_label").html("Not connected");
    };

  ws.onopen = () => {
      $("#connection_label").html("Connected");
    };

  $("submit-button").on("click", () => {
      console.log("submat");
  });
});
