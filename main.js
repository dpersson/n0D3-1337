require.paths.unshift(__dirname + '/lib');
require.paths.unshift(__dirname);
require.paths.unshift(__dirname + '/deps/express/lib')

var sys         = require('sys');
var fs          = require('fs');
var crypto      = require('crypto');
var mongo       = require('deps/node-mongodb-native/lib/mongodb');
var express     = require('deps/express');
var TimeSocket  = require('lib/TimeSocket').TimeSocket;
var Users       = require('lib/Users').Users;

var app     = express.createServer();
var pub     = __dirname + '/public';

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.bodyDecoder());
app.use(express.cookieDecoder());
app.use(express.session());
app.use(express.logger());
app.use(express.compiler({ src: pub, enable: ['sass'] }));
app.use(express.staticProvider(pub));

var db = new mongo.Db('1337', new mongo.Server('localhost', 27017, {}), {});
var users = new Users();

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

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function authenticate(name, pass, fn){
  users.findAll(db, function(error, user_collection){
    var user;
    for(var user in user_collection) {
      if(typeof (user_collection[user][name]) !== 'undefined') {
        sys.log(JSON.stringify((user_collection[user][name])));
        user = user_collection[user][name];
      }
    }

    if(!user) return fn(new Error('Cannot find user'));
  
    if(user.pass == md5(pass + user.salt)) return fn(null, user);

    fn(new Error('Invalid password'));
  });
}

db.open(function(p_db) {
  app.configure(function(){
    app.set('root', __dirname);
    app.set('db', db);
    
    try {
      var configJSON = fs.readFileSync(__dirname + '/config/app.json');
    } catch(e) {
      sys.log('File config/app.json not found.');
    }

    sys.log('Started server with config: ');
    sys.log(configJSON);
    var config = JSON.parse(configJSON.toString());

    for(var i in config) {
      app.set(i, config[i]);
    }
  });
  
  var timeSocket = new TimeSocket();
  timeSocket.init();

  app.get('/', function(req, res){
    res.redirect('login');
  });

  app.get('/main', function(req, res){
    res.render('main', {
      locals: {title: 'n0D3-1337'}
    });
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
    res.render('login', {
      locals: {title: 'n0D3-1337'}
    });
  });

  app.post('/register', function(req, res) {
    users.findAll(db, function(error, user_collection){
      var user = false;
      for(var user in user_collection) {
        if(typeof (user_collection[user][req.body.username]) !== 'undefined') {
          sys.log('User already exist.');
          user = true;
        }
      }

      if(user == false) {
        var user = new Object();
        eval("user = [{" + req.body.username + ":{'name':'" + req.body.username + "','salt':'randomly-generated-salt', 'pass':'" + md5(req.body.password + 'randomly-generated-salt') + "'}}];");

        users.save(db, user, function(error, docs){
          sys.log('Registration success');
          req.session.success = 'Registration success';
          res.redirect('/');
        });
      }
      else {
        sys.log('User already exists');
        req.session.error = 'User already exists. Choose another name.';
      }

      res.redirect('back');
    });
  });

  app.post('/login', function(req, res) {
    authenticate(req.body.username, req.body.password, function(err, user) {
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
        + ' username and password.';
      }

      res.redirect('back');
    });
  });

  app.listen(3000);
});
