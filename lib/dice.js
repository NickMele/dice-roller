var _ = require('lodash');

// rolls the die and returns the outcome
function roll(faces) {
  var min = 1;
  var max = faces;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// execute command
function execute(command) {
  var parsed = parse(command);
  var results = {};
  var text = [];
  var verbose_text = [];
  var outcome = {
    rolls: [],
    total: 0
  };

  // make the rolls
  _.times(parsed.times, function(n) {
    var rolled = roll(parsed.faces);
    outcome.rolls.push(rolled);
    verbose_text.push('Roll #' + (n+1) + ': ' + rolled);
  });

  // do we need to keep a certain number of the rolls?
  if (parsed.keep) {
    outcome.original_rolls = outcome.rolls;
    outcome.rolls = _.sample(outcome.original_rolls, parsed.keep);
    verbose_text.push('Keeping ' + parsed.keep + ' of ' + parsed.times + ' rolls: ' + outcome.rolls.toString());
  }

  // do we need to keep the highest or lowest roll?
  if (parsed.highest) {
    var max = _.max(outcome.rolls);
    outcome.original_rolls = outcome.original_rolls || outcome.rolls;
    outcome.rolls = [ max ];
    verbose_text.push('Selecting the highest roll: ' + max);
  } else if (parsed.lowest) {
    var min = _.min(outcome.rolls);
    outcome.original_rolls = outcome.original_rolls || outcome.rolls;
    outcome.rolls = [ min ];
    verbose_text.push('Selecting the lowest roll: ' + min);
  }

  // determine the total of the rolls without the modifier
  outcome.total = _.reduce(outcome.rolls, function(sum, roll) {
    return sum + roll;
  });
  if (parsed.times > 1) {
    text.push('( ' + outcome.rolls.join(' + ') +' )');
    verbose_text.push('Adding up all the rolls: ' + outcome.rolls.join(' + ') + ' = ' + outcome.total);
  }

  // apply the multiplier
  if (parsed.multiplier > 1) {
    text.push('x ' + parsed.multiplier);
    verbose_text.push('Applying the multiplier: ' + outcome.total + ' x ' + parsed.multiplier + ' = ' + (outcome.total * parsed.multiplier));
    outcome.total *= parsed.multiplier;
  }

  // add the modifier
  if (parsed.modifier > 0) {
    text.push('+ ' + parsed.modifier);
    verbose_text.push('Adding the modifier: ' + outcome.total + ' + ' + parsed.modifier + ' = ' + (outcome.total + parsed.modifier));
    outcome.total += parsed.modifier;
  }

  if (parsed.times > 1) {
    text.push('= ' + outcome.total);
  } else {
    text.push(outcome.total);
  }
  verbose_text.push('The result of ' + command + ' is ' + outcome.total);

  results = {
    command: command,
    parsed: parsed,
    outcome: outcome,
    text: text.join(' '),
    verbose_text: verbose_text
  };

  return results;
}

// parses a command given in dice notation
function parse(command) {
  var parsed = {};

  // determine number of dice to roll
  var times = command.match(/^(\d+)/);
  parsed.times = times && times[1] && parseInt(times[1]) || 1;

  // determine the number of faces
  var faces = command.match(/d(\d+)/i);
  parsed.faces = faces && faces[1] && parseInt(faces[1]) || 20;

  // determine the number of dice to keep
  var keep = command.match(/\(k(\d+)\)/i);
  parsed.keep = keep && keep[1] && parseInt(keep[1]) || null;

  // determine if should keep the lowest rolled dice
  var lowest = /-L/.test(command);
  parsed.lowest = lowest;
  // determine if should keep the highest rolled dice
  var highest = /-H/.test(command);
  parsed.highest = highest;

  // determine the multiplier
  var multiplier = command.match(/x(\d+)/);
  parsed.multiplier = multiplier && multiplier[1] && parseInt(multiplier[1]) || 1;

  // determine the modifier
  var modifier = command.match(/(\+\d+$|-\d+)$/);
  parsed.modifier = modifier && modifier[1] && parseInt(modifier[1]) || 0;

  return parsed;
}

// turns a parsed command into a command string
function format(parsed) {
  var command = '';

  // add the number of dice to be rolled
  command += parsed.times || 1;

  // add the number of faces
  command += 'd' + parsed.faces || 20;

  // add dice to keep command
  if (parsed.keep) {
    command += '(k' + parsed.keep + ')';
  }

  // add keep lowest command
  if (parsed.lowest) {
    command += '-L';
  }

  // add the multipier
  if (parsed.multiplier && parsed.multiplier != '1') {
    command += 'x' + parsed.multiplier;
  }

  // add the modifier
  if (parsed.modifier && parsed.modifier > 0) {
    command += '+' + parsed.modifier;
  } else if (parsed.modifier) {
    command += parsed.modifier;
  }

  return command || undefined;
}

module.exports = {
  roll: roll,
  execute: execute,
  parse: parse,
  format: format
};
