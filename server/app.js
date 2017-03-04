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

function ensureOwnership(req, res, next) {
  if (req.params.userId !== req.user._id.toString()) {
    res.status(401).send({ msg: 'Unauthorized' });
  } else {
    next();
  }
}

function userResponse(user) {
  return { username: user.username, email: user.email, _id: user._id };
}

app.post('/api/login', (req, res) => {
  db.getUserByName(req.body.username)
    .then((resp) => {
      if (!resp.username) {
        res.status(401).send({ message: 'Incorrect username.' });
      } else if (!db.validatePassword(req.body.password, resp.pw)) {
        res.status(401).send({ message: 'Incorrect password.' });
      } else {
        const payload = userResponse(resp);
        payload.token = generateToken(payload._id);
        res.status(200).send(payload);
      }
    })
    .catch((err) => {
      console.log('There was some error', err);
    });
});

app.post('/api/logout', (req, res) => {

});

// -------------------------------------------
// USER
// -------------------------------------------

app.route('/api/user')
  .get(ensureAuthenticated, (req, res) => {
    db.getUserById(req.user._id)
      .then((resp) => {
        res.send(userResponse(resp));
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
    .then((resp) => {
      res.send(userResponse(resp));
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  });

app.route('/api/user/:userId')
  .delete([ensureAuthenticated, ensureOwnership], (req, res) => {
    db.deleteUser(req.params.userId)
      .then((resp) => {
        res.sendStatus(200);
      })
      .catch((err) => {
        res.send(err);
      });
  });

app.route('/api/user/:userId/password')
  .post([ensureAuthenticated, ensureOwnership], (req, res) => {
    db.updateUserPassword(req.params.userId, req.body.oldPass, req.body.newPass)
      .then((resp) => {
        res.sendStatus(200);
      })
      .catch((err) => {
        if (err.message === 'Incorrect password') {
          res.status(401).send({ message: 'Incorrect password.' });
        } else {
          res.status(500).send(err);
        }
      });
  });

app.route('/api/user/:userId/email')
  .post([ensureAuthenticated, ensureOwnership], (req, res) => {
    db.updateUserEmail(req.params.userId, req.body.email)
      .then((resp) => {
        console.log(resp);
        res.send(userResponse(resp));
      })
      .catch((err) => {
        res.send(err);
      });
  });

// -------------------------------------------
// COLLECTIONS
// -------------------------------------------

app.route('/api/collections')
  .get((req, res) => {
    db.getCollections(req.query.username)
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

app.route('/api/collection')
  .put(ensureAuthenticated, (req, res) => {
    var entry = { name: req.body.name, owner: { _id: req.user._id, username: req.user.username } };
    db.createCollection(entry)
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  })
  .post(ensureAuthenticated, (req, res) => {
    db.updateCollection(req.body.collection, req.user._id)
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        if (err.message === 'unauthorized') {
          res.status(401).send(err);
        } else {
          res.status(500).send(err);
        }
      });
  });

app.route('/api/collection/:id/fork')
  .post(ensureAuthenticated, (req, res) => {
    db.forkCollection(req.params.id, { _id: req.user._id,
      username: req.user.username })
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

app.route('/api/collection/:id')
  .get((req, res) => {
    db.getCollectionByPostId(req.params.id)
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  })
  .delete(ensureAuthenticated, (req, res) => {
    db.deleteCollection(req.params.id, req.user._id)
      .then((resp) => {
        res.send({});
      })
      .catch((err) => {
        if (err.message === 'unauthorized') {
          res.status(401).send(err);
        } else {
          console.log(err);
          res.status(500).send(err);
        }
      });
  });

// app.get('/', homeRoute);
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: rootpath });
});

module.exports = app;
