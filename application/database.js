var pg = require('pg'),
	connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/tengla',
  crypto = require('crypto');

var client = new pg.Client(connectionString);
client.connect();

exports.findOne = function(name, cb) {
  var q = client.query('select id, pw from users where name = ' +  name + ' limit 1;');
  q.on('end', function(err, res) {
    if (res.rows.length > 0) {
      cb(null, res.rows[0]);
    } else {
      cb(new Error('user not found'));
    }
  });
};

exports.findById = function(id, cb) {
  var q = client.query('select name from users where id = ' + id + ' limit to 1;' );
  q.on('end', function(err, res) {
    if (res.rows.length > 0) {
      cb(null, res.rows[0]);
    } else {
      cb(new Error('user not found'));
    }
  });
};

exports.addUser = function(user, cb) {
  var query = 'insert into users(name, email, pw) values (' + normalizeUser(user) + ');';
  var q = client.query(query);
  q.on('err', function(err) {
    cb(new Error('fuck'));
  });
  q.on('end', function(res) {
    cb(null, 'success!');
  }); 
};

function normalizeUser(user) {
  var keys = ['username', 'email', 'password'],
    ret = [];
  user.password = '17uTDIr5ITAaH63rt05hXA==';
  keys.forEach(function(el) {
    ret.push('\'' + user[el] + '\'');
  });
  return ret.join(',');
};