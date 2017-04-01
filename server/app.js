var express = require('express'),
  path = require('path'),
  jwt = require('jsonwebtoken'),
  moment = require('moment'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  lessMiddleware = require('less-middleware'),
  mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN }),
  db = require('./database');

var app = express();
var rootpath = path.join(__dirname, '../dist');

app.use(lessMiddleware(rootpath));
app.use('/js', express.static(path.resolve(path.join(rootpath, 'js'))));
app.use('/css', express.static(path.resolve(path.join(rootpath, 'css'))));
// app.use(express.static(rootpath));
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

  const payload = req.isAuthenticated();
  if (payload) {
    db.getUserById(payload.sub)
      .then((resp) => {
        req.user = resp;
        next();
      });
  } else {
    next();
  }
});

function generateToken(userId, rememberMe) {
  var time = rememberMe ? [5, 'days'] : [1, 'day'];
  var payload = {
    sub: userId,
    iss: 'suplmntl',
    iat: moment().unix(),
    exp: moment().add(...time).unix()
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
  db.getUserByName(req.body.user.username)
    .then((resp) => {
      if (!resp || !resp.username || !db.validatePassword(req.body.user.password, resp.pw)) {
        res.status(401).send({ message: 'User not found or incorrect password' });
      } else {
        const payload = userResponse(resp);
        payload.token = generateToken(payload._id, req.body.rememberMe);
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
        // console.log(resp);
        res.send(userResponse(resp));
      })
      .catch((err) => {
        res.send(err);
      });
  });

// -------------------------------------------
// PASSWORDS
// -------------------------------------------

app.post('/api/forgot', (req, res) => {
  db.setResetTokenForEmail(req.body.email)
    .then((resp) => {
      // send reset conf email
      /* eslint-disable prefer-template */
      const data = {
        from: 'Suplmntl <no-reply@suplmntl.com>',
        to: req.body.email,
        subject: 'Reset your password on Suplmntl',
        text: 'You are receiving this email because you (or someone else) has requested to reset the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/#/reset/' + resp.passwordResetToken + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      /* eslint-enable prefer-template */
      mailgun.messages().send(data, (error, body) => {
        // console.log(error, body);
        res.sendStatus(200);
      });
    })
    .catch((err) => {
      res.status(404).send(err.message);
    });
});

app.post('/api/reset/:token', (req, res) => {
  db.resetPasswordForToken(req.body.newPass, req.params.token)
    .then((resp) => {
      // send 'pass changed' email
      /* eslint-disable prefer-template */
      const email = resp.email;
      const data = {
        from: 'Suplmntl <no-reply@suplmntl.com>',
        to: email,
        subject: 'Your Suplmntl password has been changed',
        text: 'This is a confirmation that the password for your account ' + email + ' has just been changed.\n'
      };
      /* eslint-enable prefer-template */
      mailgun.messages().send(data, (error, body) => {
        // console.log(error, body);
        res.sendStatus(200);
      });
    })
    .catch((err) => {
      res.status(500).send(err.message);
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
        if (/not found/.test(err.message)) {
          res.status(404).send(err.message);
        } else {
          res.status(500).send(err);
        }
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


// all other requests get index.html
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: rootpath });
});

module.exports = app;
