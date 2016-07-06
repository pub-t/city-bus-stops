require('buffer-concat');
var osmtogeojson = require('osmtogeojson');
var through = require('through2');
var concat = require('concat-stream');
var buffer = '';

var transform = function (cb) {
  this.push(JSON.stringify(osmtogeojson(JSON.parse(buffer))));
  cb();
};

var pushData = function (data, enc, cb) {
  buffer = Buffer.concat([new Buffer(buffer), new Buffer(data)]);
  cb();
};

var transformToGeoJson = through(pushData, transform);

module.exports = transformToGeoJson;