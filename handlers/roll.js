var _ = require('lodash');
var dice = require(process.cwd() + '/lib/dice');

module.exports = function(req, res, next) {
  var command = req.params.command || 'd20';
  var results = dice.execute(command);

  return res.send(results);
};
