var bcrypt = require('bcryptjs');
var randomString = require('./utils').randomString;
var Models = require('../models');

var Users = Models.User;
var Collections = Models.Collection;

// collections
exports.getCollections = (username) => {
  return Users.filter({ username }).getJoin({ collections: true }).run();
};

exports.getCollection = (id) => {
  return Collections.get(id).getJoin({ owner: true }).run();
};

exports.createCollection = (entry) => {
  return new Collections({
    id: randomString(8),
    name: entry.name,
    private: false,
    links: [],
    ownerId: entry.owner
  }).save();
};

exports.updateCollection = (newCol) => {
  return Collections.get(newCol.id).run().then((col) => {
    return col.merge(newCol).save();
  });
};

exports.deleteCollection = (collectionId) => {
  return Collections.get(collectionId).run()
    .then((col) => {
      return col.delete();
    });
};

// users
exports.getUserById = (id) => {
  return Users.get(id).run();
};

exports.getUserByName = (username) => {
  return Users.filter({ username }).run()
    .then((resp) => {
      return resp[0];
    })
    .catch((err) => {
      throw err;
    });
};

exports.addUser = (user, cb) => {
  return Users.filter({ username: user.username }).run()
    .then((resp) => {
      if (resp.length) {
        throw new Error('Username already exists');
      }
      return Users.filter({ email: user.email });
    })
    .then((resp) => {
      if (resp.length) {
        throw new Error('Email is already registered');
      }
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
      return new Users({
        username: user.username,
        email: user.email,
        pw: user.password
      }).save();
    });
};

exports.validatePassword = (password, dbpass) => {
  return bcrypt.compareSync(password, dbpass);
};
