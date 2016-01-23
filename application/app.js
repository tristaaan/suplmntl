var express = require('express');
  request = require('request'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  lessMiddleware = require('less-middleware'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  db = require('./database');

var app = express(),
  rootpath = __dirname + '/../public';

app.use(lessMiddleware(rootpath));
app.use(express.static(rootpath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.findOne(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.pw !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.findById(id, function (err, user) {
    if (err) { 
      return cb(err); 
    }
    cb(null, user);
  });
});

var collections = {'12345': 
  {
    title: 'Search Engines', links: [
      {title:'Google', link:'http://google.com', description: 'This is the Googles, they track you.'},
      {title:'DuckDuckGo', link:'http://duckduckgo.com', description: 'd.d.g. does not track you.'}
    ]
  },
  '54321':
  {
    title: 'Swift', links: [
      {title:'About', link:'https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/Swift_Programming_Language/index.html', description: 'Intro page.'},
      {title:'Collection Types', link:'https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/Swift_Programming_Language/CollectionTypes.html#//apple_ref/doc/uid/TP40014097-CH8-ID105', description: 'Collection types are confusing as all get out, sometimes.'}
    ]  
  }
};

app.post('/login', 
  passport.authenticate('local'), 
  function(req, res) {
    res.send(res.user);
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.route('/api/user')
  .put(function(req, res) {
    db.addUser({username: req.body.username, 
      email: req.body.email, 
      password: req.body.password}, function(err, result) {
      if (err) {
        res.send({error: err.message});
      } else {
        res.send({'success': result});
      }
    });
  });

app.route('/api/collections')
  .get(function(req, res){
    var objs = [];
    Object.keys(collections).forEach(function(el){
      objs.push({id: el, title: collections[el].title, size: collections[el].links.length});
    });
    res.send(objs);
  });

app.route('/api/collection')
  .put(function(req, res){
    var newId = Math.floor(Math.random()*0xaabbcc);
    collections[newId] = {title: req.body.title, links: []};
    res.send({newId: newId, size: 0});
  })
  .post(function(req, res){
    collections[req.body.id].title = req.body.title;
  });
  
app.route('/api/collection/:id')
  .get(function(req, res){
    res.send(collections[req.params.id]);
  })
  .delete(function(req, res){
    delete collections[req.params.id];
    res.send({});
  });

app.route('/api/link')
  .put(function(req, res){
    collections[req.body.id].links.push(req.body.item);
    res.send({});
  })
  .post(function(req, res){
    collections[req.body.id].links[req.body.index] = req.body.newLink;
    res.send({});
  })
  .delete(function(req, res){
    var index = req.body.index;
    var id = req.body.colId;
    var col = collections[id];
    col.links.splice(index, 1);
    collections[id] = col;
    res.send({});
  });

// app.get('/', homeRoute);
app.get('*', function(req, res) {
  res.sendFile('index.html', {root: rootpath});
});

module.exports = app;