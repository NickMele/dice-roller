var _ = require('lodash');
var notation = require(process.cwd() + '/lib/notation');
var Die = require(process.cwd() + '/lib/die');

module.exports = function(req, res, next) {
  var command = req.params.command || 'd20';
  var parsed = notation.parse(command);
  var die = new Die(parsed.X);
  var rolls = [];
  var total = null;
  var results = {};

  // make the rolls
  _.times(parsed.A, function(n) {
    var outcome = die.roll();
    rolls.push(outcome);
  });

  // determine the total of the rolls without the modifier
  total = _.reduce(rolls, function(sum, roll) {
    return sum + roll;
  });

  results = {
    command: command,
    parsed: parsed,
    rolls: rolls,
    total: total
  };

  return res.send(results);
};
