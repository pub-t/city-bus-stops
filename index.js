var osm = require('./osm');
var busStopStream = osm.fetchCityBusStops('Hrodna');
var fs = require('fs');
var ws = fs.createWriteStream('grodno.json');
var transformNodesToGeoJson = require('./transformNodesToGeoJson');

var log = require('bunyan').createLogger({
  name: 'cityBusStops',
  src: true
});


busStopStream
  .on('error', function (error) {
    log.error('Request exception ' + error);
  })
  .on('response', function (response) {
    log.info(response);
  })
  .pipe(transformNodesToGeoJson)
  .on('error', function (error) {
    log.error(error);
  })
  .pipe(ws)
  .on('error', function (error) {
    log.error(error);
  });
