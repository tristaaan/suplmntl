var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/tengla');

const Users       = sequelize.define('users', require('./Users'));
const Collections = sequelize.define('collections', require('./Collections'));
const Items       = sequelize.define('items', require('./Items'));

module.exports.Users = Users;
module.exports.Collections = Collections;
module.exports.Items = Items;

if (process.env.DB === 'init') {
  sequelize.sync()
    .then(() => {
      console.log('Database init complete');
    })
    .catch((e) => {
      console.log('There was an error', e);
    });
}
