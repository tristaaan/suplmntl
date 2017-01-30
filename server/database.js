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

exports.updateCollection = (newCol, userId) => {
  var _id = newCol._id;
  delete newCol._id;
  return Collections.findOne({ _id }).lean().exec()
    .then((resp) => {
      if (resp.owner._id.toString() !== userId.toString()) {
        throw new Error('unauthorized');
      }
      return Collections.findOneAndUpdate({ _id }, newCol).exec();
    });
};

exports.deleteCollection = (_id, userId) => {
  return Collections.findOne({ _id }).lean().exec()
    .then((resp) => {
      if (resp.owner._id.toString() !== userId.toString()) {
        throw new Error('unauthorized');
      }
      return resp.remove().exec();
    })
    .then((resp) => {
      return Collections.find({ 'forkOf._id': _id }).exec();
    })
    .then((resp) => {
      return Promise.all(resp.map(col =>
        Collections.update({ _id: col._id }, { forkOf: null }).exec()
      ));
    });
};

exports.forkCollection = (collectionId, owner) => {
  return Collections.findOne({ _id: collectionId }).lean().exec()
    .then((col) => {
      const newCol = new Collections({
        name: col.name,
        postId: strId(),
        private: col.private,
        links: col.links,
        forkOf: { _id: col._id,
          postId: col.postId,
          owner: col.owner,
          name: col.name
        },
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
  return Users.findOne({ username }).lean().exec();
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
