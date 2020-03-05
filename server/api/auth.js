const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});
const db = require('../database');
const { userResponse, generateToken, ensureAuthenticated } = require('../utils');

function ensureOwnership(req, res, next) {
  if (req.params.userId !== req.user._id.toString()) {
    res.status(401).send({ msg: 'Unauthorized' });
  } else {
    next();
  }
}

module.exports = function users(app) {
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

  app.post('/api/logout', () => {

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
          res.send({ message: err.message });
        });
    })
    .put((req, res) => {
      db.addUser({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })
        .then((resp) => {
          const data = {
            from: 'Suplmntl <no-reply@suplmntl.com>',
            to: req.body.email,
            subject: 'Welcome to Suplmntl',
            text: `You have just created an account on Suplmntl with the username "${req.body.username}".\n\nWelcome.`
          };
          /* eslint-enable prefer-template */
          mailgun.messages().send(data, (error, body) => {
            console.log(error, body);
            res.status(200).send(userResponse(resp));
          });
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    });

  app.route('/api/user/:userId')
    .delete([ensureAuthenticated, ensureOwnership], (req, res) => {
      db.deleteUser(req.params.userId)
        .then(() => {
          res.sendStatus(200);
        })
        .catch((err) => {
          res.send(err);
        });
    });

  app.route('/api/user/:userId/password')
    .post([ensureAuthenticated, ensureOwnership], (req, res) => {
      db.updateUserPassword(req.params.userId, req.body.oldPass, req.body.newPass)
        .then(() => {
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
          text: 'You are receiving this email because you (or someone else) has requested to reset the password for your account.\n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
            + `http://${req.headers.host}/reset/${resp.passwordResetToken}\n\n`
            + 'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        /* eslint-enable prefer-template */
        mailgun.messages().send(data, (error, body) => {
          console.log(error, body);
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
        const { email } = resp;
        const data = {
          from: 'Suplmntl <no-reply@suplmntl.com>',
          to: email,
          subject: 'Your Suplmntl password has been changed',
          text: `This is a confirmation that the password for your account ${email} has just been changed.\n`
        };
        /* eslint-enable prefer-template */
        mailgun.messages().send(data, (error, body) => {
          console.log(error, body);
          res.sendStatus(200);
        });
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  });
};
