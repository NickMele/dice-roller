var config = require('./config');
var dice = require(process.cwd() + '/lib/dice');

module.exports = {
  config: config,

  handle: function(slacker, callback) {
    var command = slacker.directive || 'd20';
    var results = dice.execute(command);

    return callback(results);
  }
}
