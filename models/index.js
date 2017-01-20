var dotenv = require('dotenv');

dotenv.load();

const thinky = require('thinky')({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  db: process.env.DB_NAME
});

const User = require('./User');
const Collection = require('./Collection');

const Users = thinky.createModel('User', User);
const Collections = thinky.createModel('Collection', Collection);

Users.hasMany(Collections, 'collections', 'id', 'ownerId');
Collections.belongsTo(Users, 'owner', 'ownerId', 'id');

module.exports.User = Users;
module.exports.Collection = Collections;
