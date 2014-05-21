"use strict";

var through = require('through2');
var limit = require('limit-spawn');

function readStreamIfy(ps, maxBytes) {
  var err = '';
  var limitExceeded = false;
  var stream = through();

  if (maxBytes) {
    limit(ps, maxBytes);
  }

  ps.on('error', function(err) {
    stream.emit('error', err);
  });

  ps.on('max-limit-exceeded', function() {
    limitExceeded = true;
  });

  ps.stdout.on('data', function(data) {
    stream.emit('data', data);
  });

  ps.stderr.on('data', function(buf) {
    err += buf;
  });

  ps.on('close', function(code) {
    // code === null when child_process is killed
    if (code !== 0 && code !== null) {
      stream.emit('error', new Error('non-zero exit code ' + code + '\n\n' + err));
    } else {
      stream.emit('end', limitExceeded);
    }
  });

  // this was needed after switching to through2
  stream.pause();
  setImmediate(function() { stream.resume(); });

  return stream;
}

module.exports = readStreamIfy;
