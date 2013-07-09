var test         = require('tap').test,
    toReadStream = require('../'),
    through      = require('through'),
    fs           = require('fs'),
    spawn        = require('child_process').spawn;

test('emit data && end events', function(t) {
  var data, stream, thisFile;

  t.plan(1);

  thisFile = fs.readFileSync(__filename);
  data     = '';
  stream   = toReadStream(spawn('cat', [__filename]));

  stream.on('data', function(buf) {
    data += buf;
  });

  stream.on('end', function() {
    t.equal(thisFile.length, data.length, 'spawn cat must equal readFileSync');
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
