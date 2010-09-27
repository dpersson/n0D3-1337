$('#send').click(function(){
  if(conn){
    conn.send("Test Message");
  }
});

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
    $('#log').html(evt.data);
  };

  conn.onclose = function(){
    console.log("onclose");
  };

  conn.onopen = function(){
    console.log("onopen");
    // var i = 0;
    // var timer = setInterval(function(){
    // console.log(conn);
    // conn.send("Test Message");
    // if(i++ == 10){
    // clearInterval(timer);
    // }
    // }, 10);
  };

  console.log(conn);
}, 1000);

function rapidFire(){
  var i = 0, o = 0;
  var interval = setInterval(function(){
    var r_conn = new WebSocket("ws://localhost:8080/");
    console.log(++i, o);
    r_conn.onopen = function(){
      ++o;
    };
    if(i == 1000){
      clearInterval(interval);
    }
  }, 0);
}
