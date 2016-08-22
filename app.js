/*jshint node:true*/
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.set('port', process.env.VCAP_APP_PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(express.favicon());
//var favicon = require('serve-favicon');
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(express.logger('dev'));
var morgan = require('morgan');
app.use(morgan('dev'));
//app.use(express.bodyParser());
var bodyParser = require('body-parser');
app.use(bodyParser());
//app.use(express.methodOverride());
var methodOverride = require('method-override');
app.use(methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Handle Errors gracefully
app.use(function(err, req, res, next) {
	if(!err) return next();
	console.log(err.stack);
	res.json({error: true});
});

// Main App Page
app.get('/', routes.index);

// MongoDB API Routes
app.get('/polls/polls', routes.list);
app.get('/polls/:id', routes.poll);
app.post('/polls', routes.create);
app.post('/vote', routes.vote);

io.sockets.on('connection', routes.vote);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
