var sys = require('sys'),
  fs = require('fs'),
  Buffer = require('buffer').Buffer,
  ws = require('deps/node-websocket-server/lib/ws');

if(!TimeSocket) {
  var TimeSocket = function(){};
}

TimeSocket.prototype = {
  init: function() {
    this.setupWebSocket();
  },

  setupWebSocket: function() {
    // Websocket TCP server
    var wsServer = ws.createServer();
    wsServer.listen(8080);

    wsServer.addListener("connection", function (conn) {
      sys.log("ws connect: " + conn._id);
      conn.addListener("close", function () {
        sys.log("ws close: " + conn._id);
      });
    });

    this.wsServer = wsServer;

    sys.log('Web Socket server running at ws://*:' + 8080);
  }
};

exports.TimeSocket = TimeSocket;
