var _ = require('lodash');

function roll(sides) {
  var min = 1;
  var max = sides;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = function(req, res, next) {
  var repeat = parseInt(req.params.repeat || 1, 10);
  var sides = parseInt(req.params.sides || 20, 10);
  var modifier = parseInt(req.params.modifier || 0, 10);
  var rolls = [];
  var total = 0;
  var modified_total = 0;

  _.times(repeat, function(n) {
    var outcome = roll(sides);
    rolls.push(outcome);
  });

  total = _.reduce(rolls, function(sum, roll) {
    return sum + roll;
  });

  if (modifier) {
    modified_total = total + modifier;
  }

  var results = {
    repeat: repeat,
    sides: sides,
    modifier: modifier,
    rolls: rolls,
    total: total,
    modified_total: modified_total
  };

  return res.send(results);
};
