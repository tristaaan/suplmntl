var express = require('express'),
  path = require('path'),
  jwt = require('jsonwebtoken'),
  moment = require('moment'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  lessMiddleware = require('less-middleware'),
  db = require('./database');

var app = express();
var rootpath = path.join(__dirname, '../dist');

app.use(lessMiddleware(rootpath));
app.use(express.static(rootpath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  req.isAuthenticated = () => {
    var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      return false;
    }
  };

  if (req.isAuthenticated()) {
    const payload = req.isAuthenticated();
    db.getUserById(payload.sub)
      .then((resp) => {
        req.user = resp;
        next();
      });
  } else {
    next();
  }
});

function generateToken(userId) {
  var payload = {
    sub: userId,
    iss: 'suplmntl',
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}

app.post('/api/login', (req, res) => {
  db.getUserByName(req.body.username)
    .then((resp) => {
      if (!resp.username) {
        res.status(401).send({ message: 'Incorrect username.' });
      } else if (!db.validatePassword(req.body.password, resp.pw)) {
        res.status(401).send({ message: 'Incorrect password.' });
      } else {
        const payload = resp;
        payload.token = generateToken(payload.id);
        res.status(200).send(payload);
      }
    })
    .catch((err) => {
      console.log('there was some error', err);
    });
});

app.post('/api/logout', (req, res) => {

});

app.route('/api/user')
  .get(ensureAuthenticated, (req, res) => {
    db.getUserById(req.user.id)
      .then((resp) => {
        delete resp.pw;
        res.send(resp);
      })
      .catch((err) => {
        res.send({ error: err.message });
      });
  })
  .put((req, res) => {
    db.addUser({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
  });

app.route('/api/collections')
  .get((req, res) => {
    db.getCollections(req.query.username)
      .then((resp) => {
        res.send(resp[0].collections);
      })
      .catch((err) => {
        res.send(err);
      });
  });

app.route('/api/collection')
  .put(ensureAuthenticated, (req, res) => {
    // var newId = Math.floor(Math.random()*0xaabbcc);
    // collections[newId] = {title: req.body.title, links: []};
    // res.send({newId: newId, size: 0});
    var entry = { name: req.body.name, owner: req.user.id };
    db.createCollection(entry)
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .post(ensureAuthenticated, (req, res) => {
    db.updateCollection(req.body.collection)
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        res.send(err);
      });
  });

app.route('/api/collection/:id/fork')
  .post(ensureAuthenticated, (req, res) => {
    db.forkCollection(req.params.id, req.user.id)
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        res.send(err);
      });
  });

app.route('/api/collection/:id')
  .get((req, res) => {
    db.getCollection(req.params.id)
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        res.send(err);
      });
  })
  .delete(ensureAuthenticated, (req, res) => {
    db.deleteCollection(req.params.id)
      .then((resp) => {
        res.send({});
      })
      .catch((err) => {
        res.send(err);
      });
  });

// app.get('/', homeRoute);
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: rootpath });
});

module.exports = app;
