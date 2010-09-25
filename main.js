require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname);
require.paths.unshift(__dirname + '/deps/express/lib')

var sys   = require('sys');
var fs    = require('fs');
var crypto= require('crypto');
var mongo = require('deps/node-mongodb-native/lib/mongodb');

var express = require('deps/express');
var app = express.createServer(
    express.logger(),
    express.cookieDecoder(),
    express.staticProvider(),
    express.session(),
    express.bodyDecoder);

var db = new mongo.Db('1337', new mongo.Server('localhost', 27017, {}), {});

app.dynamicHelpers({
  message: function(req){
    var err = req.session.error;
    var msg = req.session.success;

    delete req.session.error;
    delete req.session.success;
    if (err) return '<p class="msg error">' + err + '</p>';

    if (msg) return '<p class="msg success">' + msg + '</p>';
  }
});

var users = {
  dpersson: {
    name: 'dpersson',
    salt: 'randomly-generated-salt',
    pass: md5('foobar' + 'randomly-generated-salt');
  }
};

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex';)
}

function authenticate(name, pass, fn){
  var user = users[name];

  if(!user) return fn(new Error('Cannot find user'));

  if(user.pass == md5(pass + user.salt)) return fn(null, user);

  fn(new Error('Invalid password'));
}

db.open(function(p_db) {
  app.configure(function(){
    app.set('root', __dirname);
    app.set('db', db);
    app.set('views', __dirname + '/views');

    try {
      var configJSON = fs.readFileSync(__dirname + '/config/app.json');
    } catch(e) {
      sys.log('File config/app.json not found.');
    }

    sys.log('Started server with config: ');
    sys.log(configJSON);
    var config = JSON.parse(configJSON.toString());
  });

  app.get('/', function(req, res){
    res.redirect('/login');
  });

  app.get('/logout', function(req, res) {
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function(){
      res.redirect('home');
    });
  });

  app.get('/login', function(req, res){
    if (req.session.user) {
      req.session.success = 'Authenticated as ' + req.session.user.name
      + ' click to <a href="/logout">logout</a>.';
    }
    res.render('login');
  });

  app.post('/login', function(req, res) {
    authenticate(req.body.username, req.body.password, function(err, user){
      if (user) {
        // Regenerate session when signing in
        // to prevent fixation 
        req.session.regenerate(function(){
          // Store the user's primary key 
          // in the session store to be retrieved,
          // or in this case the entire user object
          req.session.user = user;
        });
      } else {
        req.session.error = 'Authentication failed, please check your '
        + ' username and password.'
        + ' (use "tj" and "foobar")';
      }
      res.redirect('back');
    });
  });
 
  app.listen(3000);
});
