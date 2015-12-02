var express = require('express');
var router = express.Router();
var pg = require('pg');
var path = require('path');
var connectionString = 'postgres://postgres:1234@localhost:5432/todo';

router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

router.post('/api/v1/todos', post);
router.get('/api/v1/todos', get);
router.put('/api/v1/todos/:todo_id', put);
router.delete('/api/v1/todos/:todo_id', remove);

function errorResponse(error) {
	done();
	console.log(error);
	return response.status(500).json({success: false, data: error});
}

function get(request, response) {
	var results = [];
	pg.connect(connectionString, function(error, client, done) {
		if(error) {
			return errorResponse(error);
		}

		var query = client.query("SELECT * FROM items ORDER BY id ASC");

		query.on('row', function(row) {
			results.push(row);
		});

		query.on('end', function() {
			done();
			return response.json(results);
		});
	});
}

function post(request, response) {
	var results = [];
	var data = {
		text: request.body.text,
		complete: false
	};

	pg.connect(connectionString, function(error, client, done) {
		if(error) {
			return errorResponse(error);
		}

		client.query('INSERT INTO items(text, complete) values ($1, $2)', [data.text, data.complete]);
		
		var query = client.query("SELECT * FROM items ORDER BY id ASC");

		query.on('row', function(row) {
			results.push(row);
		});

		query.on('end', function() {
			done();
			return response.json(results);
		});
	})
}

function put(request, response) {
	var results = [];
	var id = request.params.todo_id;

	var data = {
		text: request.body.text,
		complete: request.body.complete
	};

	pg.connect(connectionString, function(error, client, done) {
		if(error) {
			return errorResponse(error);
		}

		client.query("UPDATE items SET text=($1), complete=($2) WHERE id=($3)", [data.text, data.complete, id]);

		var query = client.query("SELECT * FROM items WHERE id = ($1)", [id]);

		query.on('row', function(row) {
			results.push(row);
		});

		query.on('end', function() {
			done();
			return response.json(results);
		});

	});
}

function remove(request, response) {
	var results = [];
	var id = request.params.todo_id;

	pg.connect(connectionString, function(error, client, done) {
		
		if(error) {
			return errorResponse(error);
		}

		client.query("DELETE FROM items WHERE id=($1)", [id]);

		var query = client.query("SELECT * FROM items");

		query.on('row', function(row) {
			results.push(row);
		});

		query.on('end', function() {
			done();
			return response.json(results);
		});
	});
}

module.exports = router;
