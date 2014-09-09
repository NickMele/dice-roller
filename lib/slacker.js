var _ = require('lodash');
var bots = require(process.cwd() + '/bots');

function parse(req, res, next) {
  // create stash object
  var slacker = res.slacker = {};

  // clone the post body, which is the "outgoing" message from slack
  slacker.outgoing = _.clone(req.body);

  // the text is the trigger + directive, we parse out the directive
  var text = slacker.outgoing.text;
  var trigger = slacker.outgoing.trigger_word;
  slacker.directive = text.replace(new RegExp(trigger, 'i'), '').trim();

  return next();
}

function handle(req, res, next) {
  var slacker = res.slacker;
  var trigger = slacker.outgoing.trigger_word;

  var bot = _.find(bots, function(bot) {
    return _.has(bot.config, 'triggers') && _.contains(bot.config.triggers, trigger);
  });

  if (bot) {
    slacker.config = bot.config;
    if (bot.handle && typeof bot.handle === 'function') {
      bot.handle(slacker, function(data) {
        slacker.data = data;
        return next();
      });
    } else {
      return next();
    }
  } else {
    return next(new Error('Could not find a bot that matched that command'));
  }

}

function respond(req, res, next) {
  var slacker = res.slacker;
  var data = slacker.data;
  var config = slacker.config;
  var payload = {
    name: config && config.name,
    channel: config && config.channel || slacker.outgoing.channel,
    text: data && data.text
  };
  return res.send(payload);
}

module.exports = {
  parse: parse,
  handle: handle,
  respond: respond
}
