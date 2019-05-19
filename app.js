var express = require('express');
var jsonServer = require('json-server');
var cors = require('cors');
var server = express();
// ...

// You may want to mount JSON Server on a specific end-point, for example /api
// Optiona,l except if you want to have JSON Server defaults
// server.use('/api', jsonServer.defaults()); 

server.use(cors());
server.use('/api', jsonServer.router('./db/db.json'));

server.listen(4000, function(){
	console.log('server running on port 4000')
});