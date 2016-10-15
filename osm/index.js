var nconf = require('../config');
var osm = require('./osmRequests');
var fs = require('fs');
var log = require('bunyan').createLogger(nconf.get('logOptions'));

//OSM Streams
var osmBusStopStream = osm.fetchCityBusStops('Hrodna', nconf.get('requestOptions'));
var osmRoutes = osm.fetchCityRoutes('Hrodna', nconf.get('requestOptions'));

//output files
var osmWriteStream = fs.createWriteStream('./busStops/osmGrodno.json');
var osmRoutesStream = fs.createWriteStream(('./busStops/osmRoutes.json'));

//transform
var transformNodesToGeoJson = require('./transformNodesToGeoJson')();
var transformNodesToRoutes = require('./transformNodesToRoutes')();

//Error handler
function handleError(error) {
  log.error(error.name + ': ' + error.message);
}

function getOsmBusStops() {
  osmBusStopStream
    .on('error', handleError)
    .on('response', function (response) {
      log.info(response);
    })
    .pipe(transformNodesToGeoJson)
    .on('error', handleError)
    .pipe(osmWriteStream)
    .on('error', handleError);
}

function getOsmRoutes() {
  osmRoutes
    .on('error', handleError)
    .on('response', function (response) {
      log.info(response)
    })
    .pipe(transformNodesToRoutes)
    .on('error', handleError)
    .pipe(osmRoutesStream)
    .on('error', handleError);
}

module.exports = {
  getOsmBusStops: getOsmBusStops,
  getOsmRoutes: getOsmRoutes,
};
