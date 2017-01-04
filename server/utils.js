var randomBytes = require('crypto').randomBytes;
var jwt = require('jsonwebtoken');
var moment = require('moment');

module.exports.randomString = function(size) {
  if (size === 0) {
    throw new Error('Zero-length randomString is useless.');
  }
  let chars = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
               'abcdefghijklmnopqrstuvwxyz' +
               '0123456789');
  let objectId = '';
  let bytes = randomBytes(size);
  for (let i = 0; i < bytes.length; ++i) {
    objectId += chars[bytes.readUInt8(i) % chars.length];
  }
  return objectId;
}

module.exports.generateToken = function(user) {
  var payload = {
    iss: 'localhost',
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}
