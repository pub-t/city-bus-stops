require('buffer').Buffer
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
}

util.inherits(TransformNodesToGeoJson, Duplex);

TransformNodesToGeoJson.prototype._read = function readBytes(n) {
};

TransformNodesToGeoJson.prototype._write = function (chunk, enc, cb) {
  if (this.readFlag === true) {
    this.push(chunk);
    this.buffer= [];
  } else {
    this.buffer = Buffer.concat([new Buffer(this.buffer), new Buffer(chunk)]);
  }
  cb();
};

function transformNodes(data) {
  return JSON.stringify(osmtogeojson(JSON.parse(data.toString())))
}

var transformNodesToGeoJsonObject = new TransformNodesToGeoJson();
transformNodesToGeoJsonObject
  .on('finish', function () {
    transformNodesToGeoJsonObject.buffer = transformNodes(transformNodesToGeoJsonObject.buffer);
    transformNodesToGeoJsonObject.readFlag = true;
    transformNodesToGeoJsonObject.write(transformNodesToGeoJsonObject.buffer.toString());
  });

module.exports = transformNodesToGeoJsonObject;
