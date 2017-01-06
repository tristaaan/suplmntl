var express = require('express'),
  request = require('request'),
  path = require('path'),
  crypto = require('crypto'),
  jwt = require('jsonwebtoken'),
  moment = require('moment'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  lessMiddleware = require('less-middleware'),
  db = require('./database');

var app = express()
var rootpath = path.join(__dirname, '../dist');

app.use(lessMiddleware(rootpath));
app.use(express.static(rootpath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(function(req, res, next) {
  req.isAuthenticated = () => {
    var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      return false;
    }
  };

  if (req.isAuthenticated()) {
    var payload = req.isAuthenticated();
    db.getUserById(payload.sub)
      .then((resp) => {
        req.user = resp.dataValues;
        next();
      });
  } else {
    next();
  }
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

function generateToken(userId) {
  var payload = {
    sub: userId,
    iss: 'suplmntl',
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

app.post('/api/login', function(req, res) {
  db.getUserByName(req.body.username)
    .then(resp => {
      if (!resp.dataValues.username) {
        res.status(401).send({ message: 'Incorrect username.' });
      } else if (!db.validatePassword(req.body.password, resp.dataValues.pw)) {
        res.status(401).send({ message: 'Incorrect password.' });
      } else {
        var payload = resp.dataValues;
        payload.token = generateToken(payload.id);
        res.status(200).send(payload);
      }
    })
    .catch(err => {
      console.log('there was some error', err);
    });
});

app.route('/api/user')
  .get(ensureAuthenticated, function(req, res) {
    db.getUserById(req.user.id)
      .then((resp) => {
        delete resp.pw;
        res.send(resp);
      })
      .catch((err) => {
        res.send({ error: err.message });
      })
  })
  .put(function(req, res) {
    db.addUser({
      username: req.body.username, 
      email: req.body.email, 
      password: req.body.password
    })
    .then(function(result) {
      res.send({ success: result });
    })
    .catch((err) => {
      res.send({ error: err.message });
    })
  });

app.route('/api/collections')
  .get(function(req, res) {
    db.getCollections(req.query.username)
      .then(resp => {
        res.send(resp);
      })
      .catch(err => {
        res.send(err);
      })
    });

app.route('/api/collection')
  .put(ensureAuthenticated, function(req, res){
    // var newId = Math.floor(Math.random()*0xaabbcc);
    // collections[newId] = {title: req.body.title, links: []};
    // res.send({newId: newId, size: 0});
    var entry = {name: req.body.name, owner: req.user.id };
    db.createCollection(entry)
      .then((resp) => {
        res.send({success: resp});
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .post(ensureAuthenticated, function(req, res){
    collections[req.body.id].title = req.body.title;
  });
  
app.route('/api/collection/:id')
  .get(function(req, res){
    db.getCollection(req.query.id)
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        res.send(err);
      })
    // res.send(collections[req.query.id]);
  })
  .delete(ensureAuthenticated, function(req, res){
    delete collections[req.query.id];
    res.send({});
  });

app.route('/api/link')
  .put(ensureAuthenticated, function(req, res){
    collections[req.body.id].links.push(req.body.item);
    res.send({});
  })
  .post(ensureAuthenticated, function(req, res){
    collections[req.body.id].links[req.body.index] = req.body.newLink;
    res.send({});
  })
  .delete(ensureAuthenticated, function(req, res){
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