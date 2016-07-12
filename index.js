var osm = require('./osm');
osmBusStopStream = osm.fetchCityBusStops('Hrodna');
var fs = require('fs');
var ws = fs.createWriteStream('grodno.json');
var transformNodesToGeoJson = require('./transformNodesToGeoJson');

var log = require('bunyan').createLogger({
  name: 'cityBusStops',
  src: true
});

function handleError(error) {
  log.error(error);
}

osmBusStopStream
  .on('error', handleError)
  .on('response', function (response) {
    log.info(response);
  })
  .pipe(transformNodesToGeoJson)
  .on('error', handleError)
  .pipe(ws)
  .on('error', handleError);

