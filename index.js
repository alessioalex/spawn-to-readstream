var through = require('through'),
    limit   = require('limit-spawn');

function readStreamIfy(ps, maxBytes) {
  var stream, err;

  err           = '';
  limitExceeded = false;
  stream        = through();

  if (maxBytes) { limit(ps, maxBytes); }

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

  return stream;
}

module.exports = readStreamIfy;
