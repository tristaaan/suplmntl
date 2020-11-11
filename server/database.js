const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { randomString } = require('./utils');

/* eslint-disable arrow-body-style */

if (process.env.MONGO_DEBUG) {
  mongoose.set('debug', (collectionName, method, query) => {
    console.log(`${collectionName}.${method} (${JSON.stringify(query, null, 2)})`);
  });
}

const Users = mongoose.model('User', require('../models/User'));
const Collections = mongoose.model('Collection', require('../models/Collection'));

let mongoURI;
if (process.env.MONGODB_URI) {
  mongoURI = process.env.MONGODB_URI;
} else {
  mongoURI = 'mongodb://localhost/suplmntl';
}

mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error',
  console.error.bind(console, 'connection error:')
);
db.once('open', function() {
  console.log('connected to database...');
});

mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
const db = mongoose.connection;
db.on('error',
  console.error.bind(console, 'connection error:')
);
db.once('open', async function() {
  console.log('connected to database...');
  if (process.env.NODE_ENV === 'test') {
    console.log('dropping old entries');

    await Users.deleteMany({});
    await Collections.deleteMany({});
  }
});

function strId() {
  return randomString(8);
}

// ----------------------------------
// collections
// ----------------------------------

exports.getCollections = (username) => {
  return Users.findOne({ username }).exec()
    .then((user) => {
      if (!user) {
        throw new Error('User not found.');
      }
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

exports.updateCollection = (col, userId) => {
  const newCol = { ...col };
  const { _id } = newCol;
  delete newCol._id;
  return Collections.findOne({ _id }).exec()
    .then((resp) => {
      if (resp.owner._id.toString() !== userId.toString()) {
        throw new Error('unauthorized');
      }
      return Collections.findOneAndUpdate({ _id }, newCol, {new: true}).exec();
    });
};

function deleteCollection(_id, userId) {
  return Collections.findOne({ _id }).exec()
    .then((resp) => {
      if (resp.owner._id.toString() !== userId.toString()) {
        throw new Error('unauthorized');
      }
      // if the collection has forks, update them, then delete the collection
      if (resp.forks > 0) {
        return Collections.updateMany({ 'forkOf._id': _id }, { forkOf: null })
          .then(() => {
            return resp.remove();
          });
      // if the collection is a fork, update parent
      } else if (resp.forkOf !== null) {
        return Collections.findOne({ '_id': resp.forkOf._id }).lean().exec()
          .then((col) => {
            const newCount = col.forks - 1;
            return Collections.updateOne({ _id: col._id }, { forks: newCount }).exec();
          })
          .then(() => {
            return resp.remove();
          });
      }
      // otherwise delete collection
      return resp.remove();
    });
};

// separate so it can be called from within this file
exports.deleteCollection = deleteCollection;

exports.forkCollection = (collectionId, newOwner) => {
  let foundCollection;
  return Collections.findOne({ _id: collectionId }).lean().exec()
    .then((col) => {
      // update fork count on parent
      const newCount = col.forks + 1;
      foundCollection = { ...col };
      return Collections.updateOne({ _id: col._id }, { forks: newCount }).exec();
    })
    .then((resp) => {
      const newCol = new Collections({
        name: `fork of ${foundCollection.name}`,
        postId: strId(),
        private: foundCollection.private,
        links: foundCollection.links,
        forkOf: {
          _id: foundCollection._id,
          postId: foundCollection.postId,
          owner: foundCollection.owner,
          name: foundCollection.name,
        },
        owner: newOwner
      });
      return newCol.save();
    });
};

// ----------------------------------
// users
// ----------------------------------

function validatePassword(password, dbpass) {
  return bcrypt.compareSync(password, dbpass);
}

// separate so it can be called from within this file
exports.validatePassword = validatePassword;

exports.getUserById = (_id) => {
  return Users.findOne({ _id }).exec();
};

exports.getUserByName = (username) => {
  return Users.findOne({ username }).lean().exec();
};

exports.addUser = (user) => {
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
      return new Promise((res, rej) => {
        bcrypt.genSalt(10, (saltErr, salt) => {
          if (saltErr) rej(saltErr);
          bcrypt.hash(user.password, salt, (hashErr, hash) => {
            if (hashErr) rej(hashErr);
            res(hash);
          });
        });
      });
    })
    .then((pw) => {
      return new Users({
        username: user.username,
        email: user.email,
        pw
      }).save();
    });
};

exports.updateUserEmail = (_id, email) => {
  return Users.findOneAndUpdate({ _id }, { email }, { new: true }).exec();
};

exports.updateUserPassword = (_id, oldPass, newPass) => {
  return Users.findOne({ _id }).exec()
    .then((resp) => {
      if (!validatePassword(oldPass, resp.pw)) {
        throw new Error('Incorrect password');
      }
      const hashpass = bcrypt.hashSync(newPass, bcrypt.genSaltSync(10));
      return Users.updateOne({ _id }, { pw: hashpass }).exec();
    });
};

exports.deleteUser = (userId) => {
  return Collections.deleteMany({ 'owner._id': userId })
    .then(() => {
      return Users.findOneAndRemove({ _id: userId }).exec();
    });
};

// ----------------------------------
// password reset
// ----------------------------------

exports.setResetTokenForEmail = (email) => {
  return Users.findOne({ email }).exec()
    .then((user) => {
      if (!user) {
        throw new Error('Cannot find given email');
      }
      return new Promise((resolve) => {
        crypto.randomBytes(16, (err, buf) => {
          const token = buf.toString('hex');
          resolve({ token, user });
        });
      });
    })
    .then((resp) => {
      // console.log('find and update', resp);
      return Users.findOneAndUpdate({ _id: resp.user._id }, {
        passwordResetToken: resp.token,
        passwordResetExpires: new Date(Date.now() + 3600000), // 1 hour
      }, { new: true }).exec();
    });
};

exports.resetPasswordForToken = (newPassword, passwordResetToken) => {
  return Users.findOne({ passwordResetToken,
    passwordResetExpires: { $gt: new Date() } }).exec()
    .then((user) => {
      if (!user) {
        throw new Error('Cannot find reset token');
      }
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (saltErr, salt) => {
          if (saltErr) reject(saltErr);
          bcrypt.hash(newPassword, salt, (hashErr, hash) => {
            if (hashErr) reject(hashErr);
            resolve({ user, hash });
          });
        });
      });
    })
    .then((resp) => {
      return Users.findOneAndUpdate({ _id: resp.user._id }, {
        pw: resp.hash,
        passwordResetToken: null,
        passwordResetExpires: null,
      }, { new: true }).exec();
    });
};
