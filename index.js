var nconf = require('./config');
var osm = require('./osm/osm');
osmBusStopStream = osm.fetchCityBusStops('Hrodna', nconf.get('request_time'));
var fs = require('fs');
var ws = fs.createWriteStream('grodno.json');
var transformNodesToGeoJson = require('./osm/transformNodesToGeoJson');

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

