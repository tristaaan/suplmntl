var pg = require('pg'),
  connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/tengla';

var client = new pg.Client(connectionString);
client.connect();
var items = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, name VARCHAR(64) not null, private BOOLEAN DEFAULT false, items JSON, owner SERIAL REFERENCES users (id));');
items.on('end', function() { 
  client.end(); 
});