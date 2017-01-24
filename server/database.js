var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var randomString = require('./utils').randomString;

const Users = mongoose.model('User', require('../models/User'));
const Collections = mongoose.model('Collection', require('../models/Collection'));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/suplmntl', (err) => {
  if (err) { throw err; }
  console.log('db connected...');
});

function strId() {
  return randomString(8);
}

// collections
exports.getCollections = (username) => {
  return Users.findOne({ username }).exec()
    .then((user) => {
      return Collections.find({ 'owner._id': user._id }).exec();
    });
};

exports.getCollectionByPostId = (postId) => {
  return Collections.findOne({ postId }).exec();
};

exports.getCollection = (_id) => {
  return Collections.findOne({ _id }).exec();
};

exports.createCollection = (entry) => {
  return new Collections({
    name: entry.name,
    postId: strId(),
    private: false,
    links: [],
    owner: entry.owner
  }).save();
};

exports.updateCollection = (newCol) => {
  var _id = newCol._id;
  delete newCol._id;
  return Collections.findOneAndUpdate({ _id }, newCol).exec();
};

exports.deleteCollection = (_id) => {
  return Collections.findOneAndRemove({ _id }).exec();
};

exports.forkCollection = (collectionId, owner) => {
  return Collections.findOne({ _id: collectionId }).exec()
    .then((col) => {
      const newCol = new Collections({
        name: col.name,
        postId: strId(),
        private: col.private,
        links: col.links,
        forkOf: { owner: col.owner, postId: col.postId, name: col.name },
        owner
      });
      return newCol.save();
    });
};

// users
exports.getUserById = (_id) => {
  return Users.findOne({ _id }).exec();
};

exports.getUserByName = (username) => {
  return Users.findOne({ username }).exec()
    .then((resp) => {
      return resp._doc;
    });
};

exports.addUser = (user, cb) => {
  return Users.find({ username: user.username }).exec()
    .then((resp) => {
      if (resp.length) {
        throw new Error('Username already exists');
      }
      return Users.find({ email: user.email }).exec();
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
