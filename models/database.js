var pg = require('pg');
var connectionString  = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/todo'

var client = new pg.Client(connectionString);
client.connect();

var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) NOT NULL, complete BOOLEAN)');
query.on('end', function() {
	client.end();
});