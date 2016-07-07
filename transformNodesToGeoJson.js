require('buffer').Buffer
var osmtogeojson = require('osmtogeojson');
var through = require('through2');
var buffer = '';

var transform = function (cb) {
  try {
    this.push(JSON.stringify(osmtogeojson(JSON.parse(buffer))));
    cb();
  } catch (error) {
    cb(error);

  }
};

var pushData = function (data, enc, cb) {
  try {
    buffer = Buffer.concat([new Buffer(buffer), new Buffer(data)]);
    cb();
  } catch (error) {
    cb(error);
  }
};

var transformToGeoJson = through(pushData, transform);

module.exports = transformToGeoJson;