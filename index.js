var osm = require('./osm');
var busStopStream = osm.fetchCityBusStops('Hrodna');
var fs = require('fs');
var osmtogeojson = require('osmtogeojson');
var through = require('through2');
var buffer = '';

var transformNodesToGeoJson = function (cb) {
  this.push(JSON.stringify(osmtogeojson(JSON.parse(buffer))));
  cb();
};

var pushData = function (data, enc, cb) {
  buffer +=data;
  cb();
};

function loadBusStops() {
  return busStopStream
    .pipe(through(
      pushData,
      transformNodesToGeoJson
    ))
    .pipe(fs.createWriteStream('grodno.json'));
}


module.exports = loadBusStops;
