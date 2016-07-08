require('buffer').Buffer
var osmtogeojson = require('osmtogeojson');
var miss = require('mississippi');
var util = require('util');
var Duplex = require('stream').Duplex;
var buffer = [];


function transformNodesToGeoJson(options) {
  if(!(this instanceof transformNodesToGeoJson)){
    return new transformNodesToGeoJson(options)
  }
  Duplex.call(this, options);
}

util.inherits(transformNodesToGeoJson, Duplex);

transformNodesToGeoJson.prototype._write =  function (chunk, enc, cb) {
  buffer.push(chunk.toString());
  console.log('All data: ', buffer);
  cb();
};

transformNodesToGeoJson.prototype._read = function readBytes(n) {
  var self = this;
  console.log('Save data');
  while (buffer.length) {
    var chunk = buffer.shift();
    if (!self.push(chunk)) {
      break;
    }
  }
  if (buffer.length) {
    readBytes(self)
  } else {
    self.push(null);
  }
};

module.exports = new transformNodesToGeoJson();