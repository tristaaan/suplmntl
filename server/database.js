var Sequelize = require('sequelize');
var bcrypt    = require('bcryptjs');

var randomString = require('./utils').randomString;
var Models = require('../models');
var Users       = Models.Users;
var Collections = Models.Collections;
var Items       = Models.Items;

var sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/tengla');

// collections
exports.getCollections = function(username) {
  return Users.findOne({
    where: { username: username },
  })
  .then(user => {
    return Collections.findAll({where: { owner: user.id }});
  });
}

exports.getCollection = function(collectionId) {
  return Collections.findOne({where: { id: collectionId }});
}

exports.createCollection = function (entry) {
  return Collections.create({
    id: randomString(8),
    name: entry.name,
    private: false,
    owner: entry.owner
  });
}

exports.updateCollectionName = function(collectionId, name) {
  return Collections.update({ name: name },
    { where: { id: collectionId }
  });
};

exports.deleteCollection = function(collectionId, cb) {
  return Collections.destroy({
    where: { id: collectionId }
  });
};

// // links

// users
exports.getUserById = function(id) {
  return Users.findOne({
    where: { id: id }
  });
}

exports.getUserByName = function(username) {
  return Users.findOne({
    where: { username: username },
  });
};

exports.addUser = function(user, cb) {
  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  return Users.create({
    username: user.username,
    email: user.email,
    pw: user.password
  });
};

exports.validatePassword = function(password, dbpass) {
  return bcrypt.compareSync(password, dbpass);
}
