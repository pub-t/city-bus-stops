require('buffer').Buffer
var util = require('util');
var Duplex = require('stream').Duplex;

function transformNodesToGeoJson(options) {
  if (!(this instanceof transformNodesToGeoJson)) {
    return new transformNodesToGeoJson(options)
  }
  Duplex.call(this, options);
  this.readArr = [];
  this.flagToRead = true;
}

util.inherits(transformNodesToGeoJson, Duplex);

transformNodesToGeoJson.prototype._read = function readBytes(n) {
  var self = this;
  while (this.readArr.length) {
    var chunk = this.readArr.shift();
    if (!self.push(chunk)) {
      break;
    }
  }
  if (this.flagToRead) {
    setTimeout(readBytes.bind(self), 1000, n);
  } else {
    self.push(null);
  }
};

transformNodesToGeoJson.prototype._write =
  function (chunk, enc, cb) {
    this.readArr.push(new Buffer(chunk));
    cb();
  };

var transformObject = new transformNodesToGeoJson();

module.exports = transformObject;

