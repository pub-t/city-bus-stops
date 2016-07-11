require('buffer').Buffer
var util = require('util');
var Duplex = require('stream').Duplex;
var osmtogeojson = require('osmtogeojson');

function transformNodesToGeoJson(options) {
  if (!(this instanceof transformNodesToGeoJson)) {
    return new transformNodesToGeoJson(options)
  }
  Duplex.call(this, options);
  this.buffer = [];
  this.readFlag = false;
}

util.inherits(transformNodesToGeoJson, Duplex);

transformNodesToGeoJson.prototype._read = function readBytes(n) {
  console.log('Buffer length: ', this.buffer.length);
};

transformNodesToGeoJson.prototype._write = function (chunk, enc, cb) {
  this.buffer = Buffer.concat([new Buffer(this.buffer), new Buffer(chunk)]);
  if (this.readFlag == true) {
    this.push(this.buffer);
    this.buffer= [];
  } 
  cb();
};

var transformObject = new transformNodesToGeoJson();
transformObject
  .on('finish', function () {
    transformObject.buffer = JSON.stringify(osmtogeojson(JSON.parse(transformObject.buffer.toString())));
    transformObject.readFlag = true;
    transformObject.write(transformObject.buffer.toString());
  });


module.exports = transformObject;