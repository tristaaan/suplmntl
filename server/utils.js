const { randomBytes } = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports.randomString = (size) => {
  if (size === 0) {
    throw new Error('Zero-length randomString is useless.');
  }
  const chars = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'
   + 'abcdefghijklmnopqrstuvwxyz'
   + '0123456789');
  let objectId = '';
  const bytes = randomBytes(size);
  for (let i = 0; i < bytes.length; i += 1) {
    objectId += chars[bytes.readUInt8(i) % chars.length];
  }
  return objectId;
};

module.exports.generateToken = (userId, rememberMe) => {
  const time = rememberMe ? [5, 'days'] : [1, 'day'];
  const payload = {
    sub: userId,
    iss: 'suplmntl',
    iat: moment().unix(),
    exp: moment().add(...time).unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
};

module.exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

module.exports.userResponse = (user) => (
  { username: user.username, email: user.email, _id: user._id }
);
