var express = require('express');
var app = express();
var port = 3000;
var roll = require('./handlers/roll');

/*
 * All rolls must follow the format below
 * http://en.wikipedia.org/wiki/Dice_notation
 * `AdX(kY)-LxCM`
 * A = the number of dice to be rolled (default: 1)
 * d = separator that stands for die or dice
 * X = the number of face of each die
 * (kY) = number of dice to keep from roll
 * -L = take the lowest dice from all the rolls
 * C = the multiplier, must be a natural number (optional, default: 1)
 * M = the modifier, must be an integer (optional, default: 0)
 * Example: 4d6x10+3 "roll 4 6 sided dice, add together, multiply by 10 and add 3
 */

app.get('/roll/:command?', roll);

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
