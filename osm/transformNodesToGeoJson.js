var util = require('util');
var Duplex = require('stream').Duplex;
var osmtogeojson = require('osmtogeojson');

function TransformNodesToGeoJson(options) {
  if (!(this instanceof TransformNodesToGeoJson)) {
    return new TransformNodesToGeoJson(options)
  }
  Duplex.call(this, options);
  this.buffer = [];
  this.readFlag = false;
  this.on('finish', function () {
    this.buffer = transformNodes(this.buffer);
    this.readFlag = true;
    this.write(this.buffer.toString());
  });
}

util.inherits(TransformNodesToGeoJson, Duplex);

TransformNodesToGeoJson.prototype._read = function readBytes(n) {
};

TransformNodesToGeoJson.prototype._write = function (chunk, enc, cb) {
  if (this.readFlag === true) {
    this.push(chunk);
    this.buffer = [];
    this.readFlag = false;
  } else {
    this.buffer = Buffer.concat([new Buffer(this.buffer), new Buffer(chunk)]);
  }
  cb();
};

function transformNodes(data) {
  return JSON.stringify(osmtogeojson(JSON.parse(data.toString())))
}

module.exports = new TransformNodesToGeoJson();
