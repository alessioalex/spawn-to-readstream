# spawn-to-readstream

### Description

Make child process spawn behave like a read stream (buffer the error, don't emit end if error emitted).

### Installation

```bash
npm install spawn-to-readstream
```

### Examples

```js
var toReadStream = require('spawn-to-readstream'),
    spawn        = require('child_process').spawn;

toReadStream(spawn('ls', ['-lah'])).on('error', function(err) {
  throw err;
}).on('end', function() {
  console.log('~~~ DONE ~~~');
}).on('data', function(data) {
  console.log('ls data :::', data.toString());
});
```

### Tests

```bash
npm test
```

## License

MIT
