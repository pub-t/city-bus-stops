var osm = require('./osm');
var busStopStream = osm.fetchCityBusStops('Hrodna');
var fs = require('fs');
var ws = fs.createWriteStream('grodno.json');
var transformToGeoJson = require('./transformNodesToGeoJson');


busStopStream
  .pipe(transformToGeoJson)
  .pipe(ws);
