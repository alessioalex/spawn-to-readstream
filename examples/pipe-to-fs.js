"use strict";

var fs = require('fs');
var toReadStream = require('../');
var spawn = require('child_process').spawn;
var path = require('path');
var out = __dirname + '/spawn_to_readstream.txt';

var spawnStream = toReadStream(spawn('cat', [path.resolve(__filename)]));

spawnStream.pipe(fs.createWriteStream(out));

spawnStream.on('end', function() {
  console.log('piped spawn output to:\n  ' + out);
  console.log('----------');

  console.log(fs.readFileSync(out, 'utf8'));
});
