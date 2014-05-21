var path = require('path');
var test = require('tap').test;
var toReadStream = require('../');
var fs = require('fs');
var spawn = require('child_process').spawn;

test('emit data && end events', function(t) {
  var thisFile = fs.readFileSync(__filename);
  var data = '';
  var stream = toReadStream(spawn('cat', [__filename]));

  stream.on('data', function(buf) {
    data += buf;
  });

  stream.on('end', function(cut) {
    t.equal(thisFile.length, data.length, 'spawn cat must equal readFileSync');
    t.equal(cut, false);
    t.end();
  });
});

test('emit error event but not end event', function(t) {
  var end = false;
  var data = '';
  var errMsg = '';
  var ps = spawn('git', ['log'], { cwd: '/tmp' });
  var stream = toReadStream(ps);

  stream.on('data', function(buf) {
    data += buf;
  });

  stream.on('end', function() {
    end = true;
  });

  stream.on('error', function(err) {
    t.ok(err instanceof Error, 'must emit Error');

    errMsg = err.message;
  });

  ps.on('close', function() {
    process.nextTick(function() {
      t.equal(data, '', 'no data event emitted');
      t.equal(end, false, 'no end event emitted');
      t.ok(/non-zero exit code/.test(errMsg), 'non zero exit code');

      t.end();
    });
  });
});

test('limit stream to number of bytes', function(t) {
  var size = 0;
  var stream = toReadStream(spawn('cat', [path.resolve(__filename)]), 2);

  stream.on('data', function(buf) {
    size += buf.length;
  });

  stream.on('end', function(cut) {
    t.equal(cut, true, 'child process was cut');
    t.end();
  });
});
