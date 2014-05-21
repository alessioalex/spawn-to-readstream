"use strict";

var toReadStream = require('../index');
var spawn = require('child_process').spawn;

toReadStream(spawn('rit', ['--git-dir=/does/not/exist', 'log'])).on('error', function(err) {
  console.log('error event', err.message);
}).on('end', function() {
  // this will not be emitted if there's an error
  console.log('end event');
});
