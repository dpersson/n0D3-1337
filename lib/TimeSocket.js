var sys = require('sys'),
  fs = require('fs'),
  Buffer = require('buffer').Buffer,
  ws = require('deps/node-websocket-server/lib/ws');

if(!TimeSocket) { var TimeSocket = {}; }

TimeSocket.prototype = {
  init: function() {
    this.setupWebSocket();
  },

  setupWebSocket: function() {
    // Websocket TCP server
    var wsServer = ws.createServer({log: false});
    wsServer.listen(8000);

    wsServer.addListener("connection", function (conn) {
      sys.log("ws connect: " + conn._id);
      conn.addListener("close", function () {
        sys.log("ws close: " + conn._id);
      });
    });

    this.wsServer = wsServer;

    sys.puts('Web Socket server running at ws://*:' + config.websocket_port);
  }
};

exports.TimeSocket = TimeSocket;
