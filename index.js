var nconf = require('./config');

var osm = require('./osm/osm');
var raspAp1 = require('./rasp.ap1/rasp.ap1');

var osmBusStopStream = osm.fetchCityBusStops('Hrodna', nconf.get('requestOptions'));
var raspAp1BusStopStream = raspAp1.loadCityBusStops(nconf.get('rasp.ap1_url'), nconf.get('requestOptions'));
var osmRoutes = osm.fetchCityRoutes('Hrodna', nconf.get('requestOptions'));

var fs = require('fs');
var osmWriteStream = fs.createWriteStream('./busStops/osmGrodno.json');
var raspAp1WriteStream = fs.createWriteStream('./busStops/raspAp1Grodno.json');
var osmRoutesStream = fs.createWriteStream(('./busStops/osmRoutes.json'));

var transformNodesToGeoJson = require('./osm/transformNodesToGeoJson')();
var parseBusStops = require('./rasp.ap1/parseBusStops')();
var transformNodesToRoutes = require('./osm/transformNodesToRoutes')();

var log = require('bunyan').createLogger(nconf.get('logOptions'));

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
  .pipe(osmWriteStream)
  .on('error', handleError);


raspAp1BusStopStream
  .on('error', handleError)
  .on('response', function (response) {
    log.info(response);
  })
  .pipe(parseBusStops)
  .on('error', handleError)
  .pipe(raspAp1WriteStream)
  .on('error', handleError);

osmRoutes
  .on('error', handleError)
  .on('response', function (response) {
    log.info(response)
  })
  .pipe(transformNodesToRoutes)
  .on('error', handleError)
  .pipe(osmRoutesStream)
  .on('error', handleError);