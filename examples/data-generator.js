"use strict";

var fs = require('fs');
var data = fs.readFileSync(__filename);

var generate = function() {
  for (var i = 0; i <= 30000; i++) {
    process.stdout.write(data + data + data);
  }

  setImmediate(generate);
};

generate();
