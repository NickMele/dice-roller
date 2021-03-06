var _ = require('lodash');
var dice = require(process.cwd() + '/lib/dice');
var bot = require(process.cwd() + '/lib/bot');

module.exports = function(req, res, next) {
  var command = req.params.command || res.locals.command || 'd20';
  var results = dice.execute(command);

  return res.send(results);
};
