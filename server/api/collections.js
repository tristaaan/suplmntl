const db = require('../database');
const { ensureAuthenticated } = require('../utils');

module.exports = function collections(app) {
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
    .put([ensureAuthenticated], (req, res) => {
      const entry = {
        name: req.body.name,
        owner: {
          _id: req.user._id,
          username: req.user.username
        }
      };
      db.createCollection(entry)
        .then((resp) => {
          res.send(resp);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    })
    .post([ensureAuthenticated], (req, res) => {
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
    .delete([ensureAuthenticated], (req, res) => {
      db.deleteCollection(req.params.id, req.user._id)
        .then(() => {
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
};
