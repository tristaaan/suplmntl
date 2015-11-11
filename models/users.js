var pg = require('pg'),
	connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/tengla';

var client = new pg.Client(connectionString);
client.connect();
var users = client.query('CREATE TABLE users(id SERIAL PRIMARY KEY, name VARCHAR(16) not null, email VARCHAR(32) not null, pw CHAR(24) not null)');
users.on('end', function() { 
  client.end(); 
});