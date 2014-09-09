var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');

var slacker = require('./lib/slacker');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// development only
if ('development' == app.get('env')) {
  app.use(errorhandler());
}

// app.get('/roll/:command?', roll);
app.post('/slack', slacker.parse, slacker.handle, slacker.respond);

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port %d', server.address().port);
});
