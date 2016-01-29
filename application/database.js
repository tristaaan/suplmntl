var pg = require('pg'),
	connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/tengla',
  bcrypt = require('bcrypt');

var client = new pg.Client(connectionString);
client.connect();

// collections
exports.getCollections = function(userId, cb) {
  var query = 'select name, id, json_array_length(items) as size ' + 
    'from items where owner=' + userId + ';'
    q = client.query(query);

  q.on('err', function(err) {
    cb(new Error('fuck'));
  });
  q.on('row', function(row, results) {
    results.addRow(row);
  });
  q.on('end', function(res) {
    cb(null, res.rows);
  });
};

exports.getCollection = function(collectionId, cb) {
  var query = 'select name, id, items from items where id=' + collectionId + ' limit 1;';
    q = client.query(query);

  q.on('err', function(err) {
    cb(new Error('fuck'));
  });
  q.on('row', function(row, results) {
    results.addRow(row);
  });
  q.on('end', function(res) {
    cb(null, res.rows[0]);
  });
};

exports.createCollection = function(entry, cb) {
  var query = 'insert into items(name, items, owner) values (' + normalizeEntry(entry) + ');';
  var q = client.query(query);

  q.on('err', function(err) {
    cb(new Error('fuck'));
  });
  q.on('end', function(res) {
    cb(null, 'success!');
  }); 
};

exports.updateCollectionTitle = function(collectionId, cb) {

};

exports.deleteCollection = function(collectionId, cb) {

};

// links

// users
exports.findOne = function(name, cb) {
  var query = 'select id, pw from users where name=\'' +  name + '\' limit 1;',
    q = client.query(query);
  q.on('err', function(err) {
    cb(new Error('fuck'));
  });
  q.on('row', function(row, results) {
      results.addRow(row);
  });
  q.on('end', function(res) {
    if (res.rows.length > 0) {
      cb(null, res.rows[0]);
    } else {
      cb(new Error('user not found'));
    }
  });
};

exports.findById = function(id, cb) {
  var q = client.query('select name from users where id = ' + id + ' limit 1;' );
  q.on('end', function(err, res) {
    if (res.rows.length > 0) {
      cb(null, res.rows[0]);
    } else {
      cb(new Error('user not found'));
    }
  });
};

exports.addUser = function(user, cb) {
  var query = 'insert into users(name, email, pw) values (' + normalizeUser(user) + ');',
    q = client.query(query);
  q.on('err', function(err) {
    cb(new Error('fuck'));
  });
  q.on('end', function(res) {
    cb(null, 'success!');
  }); 
};

exports.validatePassword = function(password, dbpass) {
  return bcrypt.compareSync(password, dbpass);
}

function normalizeUser(user) {
  var keys = ['username', 'email', 'password'],
    ret = [];
  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
  keys.forEach(function(el) {
    ret.push('\'' + user[el] + '\'');
  });
  return ret.join(',');
}

function normalizeEntry(entry) {
  var ret = ['\'' + entry.name + '\'', 
    '\'' + JSON.stringify(entry.items) + '\'', 
    1];

  return ret.join(',');
}
