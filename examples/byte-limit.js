"use strict";

var toReadStream = require('../index');
var spawn = require('child_process').spawn;
var path = require('path');

var buf = 0;
var kb = process.env.KB || 10; // limit in Kb
var limit = kb * 1024; // Kb transformed into bytes
var file = path.resolve(__dirname + '/data-generator.js');

// Note that it's a 'soft' limit, meaning the data you
// receive might be > 100 Kb, because the child process
// was stopped after receiving more than <LIMIT> bytes
toReadStream(spawn('node', [file]), limit)
  .on('error', function(err) {
    throw err;
  }).on('end', function(isLimited) {
    console.log('done, ' + buf + ' bytes received ~= ' + (buf / 1024).toFixed(2) + 'kb');
    if (isLimited) {
      console.log('child process was cut');
    }
  }).on('data', function(data) {
    buf += data.length;
    console.log(buf);
  });
