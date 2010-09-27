var sys = require('sys'),
  fs = require('fs'),
  Buffer = require('buffer').Buffer,
  ws = require('deps/node-websocket-server/lib/ws');

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

function timestamp() {
  var d = new Date();
  return [
    d.getDate(),
    months[d.getMonth()],
    [ pad(d.getHours())
    , pad(d.getMinutes())
    , pad(d.getSeconds())
    , (d.getTime() + "").substr( - 4, 4)
    ].join(':')
  ].join(' ');
};


if(!TimeSocket) {
  var TimeSocket = function(){};
}

TimeSocket.prototype = {
  init: function() {
    this.setupWebSocket();
  },

  setupWebSocket: function() {
    // Websocket TCP server
    var server = ws.createServer();

    server.addListener('listening', function(){
      sys.log('Listening for connections');
    });

    server.addListener('connection', function(conn){
      conn.send('Connection: ' + conn.id);
      
      timeStampId = setInterval ( function(){
        conn.send(timestamp());
      }, 1000 );
      
      //conn.addListener('message', function(message){
      //  conn.broadcast('<' + conn.id + '> ' + message);
      //  sys.log("message: " + message);
      //});
    });
    
    server.addListener("close", function (conn) {
      sys.log('Closing: ' + conn.id);
      // server.broadcast('<' + conn.id + '> disconnected');
      clearInterval ( timeStampId );
    });

    server.listen(8080);
    sys.log('Web Socket server running at ws://*:' + 8080);
  }
};

exports.TimeSocket = TimeSocket;
