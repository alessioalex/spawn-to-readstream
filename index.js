var through = require('through');

function readStreamIfy(ps) {
  var stream, err;

  err = '';

  stream = through();

  ps.stdout.on('data', function(data) {
    stream.emit('data', data);
  });

  ps.stderr.on('data', function(buf) {
    err += buf;
  });

  ps.on('close', function(code) {
    if (code !== 0) {
      stream.emit('error', new Error('non-zero exit code ' + code + '\n\n' + err));
    } else {
      stream.emit('end');
    }
  });

  return stream;
}

module.exports = readStreamIfy;
