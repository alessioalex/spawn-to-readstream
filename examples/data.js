"use strict";

var toReadStream = require('../index');
var spawn = require('child_process').spawn;

toReadStream(spawn('ls', ['-lah'])).on('error', function(err) {
  throw err;
}).on('end', function() {
  console.log('~~~ DONE ~~~');
}).on('data', function(data) {
  console.log('ls data :::', data.toString());
});
