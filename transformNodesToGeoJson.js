var osmtogeojson = require('osmtogeojson');
var through = require('through2');
var buffer = '';

var transform = function (cb) {
  this.push(JSON.stringify(osmtogeojson(JSON.parse(buffer))));
  cb();
};

var pushData = function (data, enc, cb) {
  buffer += data;
  cb();
};

var transformToGeoJson = through(pushData, transform);

module.exports = transformToGeoJson;