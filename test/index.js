var test         = require('tap').test,
    toReadStream = require('../'),
    through      = require('through'),
    fs           = require('fs'),
    spawn        = require('child_process').spawn;

test('emit data && end events', function(t) {
  var data, stream, thisFile;

  thisFile = fs.readFileSync(__filename);
  data     = '';
  stream   = toReadStream(spawn('cat', [__filename]));

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
  var data, stream, ps, end, errMsg;

  t.plan(5);

  end    = false;
  data   = '';
  errMsg = '';
  ps     = spawn('git', ['log'], { cwd: '/tmp' });
  stream = toReadStream(ps);

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
      t.ok(/Not a git repository/.test(errMsg), 'correct error message');
    });
  });
});

test('limit stream to number of bytes', function(t) {
  var size, stream, thisFile;

  size     = 0;
  stream   = toReadStream(spawn('cat', ['/dev/urandom']), 100);

  stream.on('data', function(buf) {
    size += buf.length;
  });

  stream.on('end', function(cut) {
    t.equal(cut, true, 'child process was cut');
    t.end();
  });
});
