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

var pushData = function (data, cb) {
  try {
    cb(null, data);
  } catch (error) {
    cb(error);
  }
};

var transformToGeoJson = miss.through(miss.concat(pushData), transform);

module.exports = transformToGeoJson;