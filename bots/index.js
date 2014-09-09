var fs = require('fs');
var path = require('path');

require('fs').readdirSync('./bots').forEach(function(file) {
  var joined = path.join(__dirname, file);

  // If its the current file ignore it
  if (file === 'index.js') return;

  if (fs.statSync(joined).isDirectory()) {
    module.exports[file] = require(joined);
  }
});
