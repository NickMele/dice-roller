var _ = require('lodash');
var async = require('async');

// rolls the die and returns the outcome
function roll(faces) {
  var min = 1;
  var max = faces;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeRolls(data) {
  var rolls = [];
  // make the rolls
  _.times(data.parsed.times, function(n) {
    var rolled = roll(data.parsed.faces);
    rolls.push(rolled);
    data.verbose.push('Roll #' + (n+1) + ': ' + rolled);
  });
  return rolls;
}

// execute command
function execute(command) {
  var parsed = parse(command);
  var data = {
    command: command,
    parsed: parsed,
    outcomes: [],
    text: [],
    verbose: []
  };

  _.times(data.parsed.repeat, function(n) {

    // start this outcome
    var outcome = {
      rolls: makeRolls(data),
      total: 0
    };

    // do we need to keep a certain number of the rolls?
    if (parsed.keep) {
      outcome.original_rolls = outcome.rolls;
      outcome.rolls = _.sample(outcome.original_rolls, parsed.keep);
      data.verbose.push('Keeping ' + parsed.keep + ' of ' + parsed.times + ' rolls: ' + outcome.rolls.toString());
    }

    // do we need to keep the highest or lowest roll?
    if (parsed.highest) {
      var max = _.max(outcome.rolls);
      outcome.original_rolls = outcome.original_rolls || outcome.rolls;
      outcome.rolls = [ max ];
      data.verbose.push('Selecting the highest roll: ' + max);
    } else if (parsed.lowest) {
      var min = _.min(outcome.rolls);
      outcome.original_rolls = outcome.original_rolls || outcome.rolls;
      outcome.rolls = [ min ];
      data.verbose.push('Selecting the lowest roll: ' + min);
    }

    // determine the total of the rolls without the modifier
    outcome.total = _.reduce(outcome.rolls, function(sum, roll) {
      return sum + roll;
    });
    if (parsed.times > 1) {
      data.text.push('( ' + outcome.rolls.join(' + ') +' )');
      data.verbose.push('Adding up all the rolls: ' + outcome.rolls.join(' + ') + ' = ' + outcome.total);
    }

    // apply the multiplier
    if (parsed.multiplier > 1) {
      data.text.push('x ' + parsed.multiplier);
      data.verbose.push('Applying the multiplier: ' + outcome.total + ' x ' + parsed.multiplier + ' = ' + (outcome.total * parsed.multiplier));
      outcome.total *= parsed.multiplier;
    }

    // add the modifier
    if (parsed.modifier > 0) {
      data.text.push('+ ' + parsed.modifier);
      data.verbose.push('Adding the modifier: ' + outcome.total + ' + ' + parsed.modifier + ' = ' + (outcome.total + parsed.modifier));
      outcome.total += parsed.modifier;
    }

    if (parsed.times > 1) {
      data.text.push('= ' + outcome.total);
    } else {
      data.text.push(outcome.total);
    }
    data.verbose.push('The result of ' + command + ' is ' + outcome.total);

    data.outcomes.push(outcome);

  });

  return data;
}

// parses a command given in dice notation
function parse(command) {
  var parsed = {};

  // determine number of dice to roll
  var times = command.match(/^\(?(\d+)/);
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
  var multiplier = command.match(/x(\d+)(?!$)/);
  parsed.multiplier = multiplier && multiplier[1] && parseInt(multiplier[1]) || 1;

  // determine the modifier
  var modifier = command.match(/(\+\d+\)?|-\d+)\)?/);
  parsed.modifier = modifier && modifier[1] && parseInt(modifier[1]) || 0;

  // determine if we need to repeat at all
  var repeat = command.match(/^(\d+)x|x(\d+)$/);
  parsed.repeat = repeat && repeat[1] && parseInt(repeat[1]) || repeat && repeat[2] && parseInt(repeat[2]) || 1;

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

  // add the repeat and add command
  if (parsed.repeat) {
    command = parsed.repeat + '(' + command + ')';
  }

  return command || undefined;
}

module.exports = {
  roll: roll,
  execute: execute,
  parse: parse,
  format: format
};
