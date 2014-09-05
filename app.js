var express = require('express');
var app = express();
var port = 3000;
var roll = require('./handlers/roll');

app.get(/^\/roll\/(\d{1})d(\d{0,2})(\+\d)?/, function(req, res) {
  var repeat = req.params[0];
  var sides = req.params[1];
  var modifier = req.params[2];
  var url = '/roll/' + repeat + '/' + sides;
  if (modifier) {
    url += '/' + modifier;
  }
  return res.redirect(url);
});
app.get('/roll/:repeat/:sides/:modifier?', roll);

var server = app.listen(port, function() {
  console.log('Listening on port %d', server.address().port);
});
