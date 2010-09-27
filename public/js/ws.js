var conn;
setTimeout(function(){
  var connect = function(){
    conn = new WebSocket("ws://localhost:8080/");
  };

  if(window["WebSocket"]){
    console.log("Connecting...");
    connect();
    console.log("Started Connection.");
  } else {
    console.log("Not Supported");
  }

  conn.onmessage = function(evt){
    console.log(evt.data);
    $('#timer').html(evt.data);
  };

  conn.onclose = function(){
    console.log("onclose");
  };

  conn.onopen = function(){
    console.log("onopen");
  };

  console.log(conn);
}, 1000);
