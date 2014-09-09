var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');

var roll = require('./handlers/roll');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/slack', function(req, res, next) {
  var text = req.body.text;
  var trigger = req.body.trigger_word;
  var command = text.replace(new RegExp(trigger, 'i'), '').trim();
  res.locals.command = command;
  return next();
});

// development only
if ('development' == app.get('env')) {
  app.use(errorhandler());
}

app.get('/roll/:command?', roll);
app.post('/slack', roll);

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port %d', server.address().port);
});
