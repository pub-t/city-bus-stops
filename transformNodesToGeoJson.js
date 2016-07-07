require('buffer').Buffer
var osmtogeojson = require('osmtogeojson');
var miss = require('mississippi');
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

var transformToGeoJson = miss.through(pushData, transform);

module.exports = transformToGeoJson;