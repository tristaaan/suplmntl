const auth = require('./auth');
const collections = require('./collections');

module.exports = function api(app) {
  auth(app);
  collections(app);
};
