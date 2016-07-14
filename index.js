var nconf = require('./config');

var osm = require('./osm/osm');
var raspAp1 = require('./rasp.ap1/rasp.ap1');

var osmBusStopStream = osm.fetchCityBusStops('Hrodna', nconf.get('requestOptions'));
var raspAp1Stream = raspAp1.loadPage(nconf.get('rasp.ap1_url'), nconf.get('requestOptions'));
var raspAp1SingleRouteStream = raspAp1.loadPage('http://rasp.ap1.by/routedetails.php?rno=1',
  nconf.get('requestOptions'));
var osmRoutes = osm.fetchCityRoutes('Hrodna', nconf.get('requestOptions'));

var fs = require('fs');
var osmWriteStream = fs.createWriteStream('./busStops/osmGrodno.json');
// var osmRoutesStream = fs.createWriteStream(('./busStops/osmRoutes.json'));
var raspAp1BusStopsStream = fs.createWriteStream('./busStops/raspAp1BusStops.json');
var raspAp1RoutesStream = fs.createWriteStream('./busStops/raspAp1Routes.json');
var raspAp1SingleRoute = fs.createWriteStream(('./busStops/raspAp1SingleRoute.json'));

var transformNodesToGeoJson = require('./osm/transformNodesToGeoJson')();
var transformNodesToRoutes = require('./osm/transformNodesToRoutes')();
var parseBusStops = require('./rasp.ap1/parseBusStops')();
var parseRoutes = require('./rasp.ap1/parseRoutes')();
var parseSingleRoute = require('./rasp.ap1/parseSingleRoute')();


var log = require('bunyan').createLogger(nconf.get('logOptions'));

function handleError(error) {
  log.error(error);
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

function getRaspAp1BusStops() {
  raspAp1Stream
    .on('error', handleError)
    .on('response', function (response) {
      log.info(response);
    })
    .pipe(parseBusStops)
    .on('error', handleError)
    .pipe(raspAp1BusStopsStream)
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

function getRaspAp1Routes() {
  raspAp1Stream
    .on('error', handleError)
    .on('response', function (response) {
      log.info(response);
    })
    .pipe(parseRoutes)
    .on('error', handleError)
    .pipe(raspAp1RoutesStream)
    .on('error', handleError);
}

function getSingleRoute() {
  raspAp1SingleRouteStream
    .on('error', handleError)
    .on('response', function (response) {
      log.info(response);
    })
    .pipe(parseSingleRoute)
    .on('error', handleError)
    .pipe(raspAp1SingleRoute)
    .on('error', handleError);
}

module.exports = {
  getOsmBusStops: getOsmBusStops,
  getRaspAp1BusStops: getRaspAp1BusStops,
  getOsmRoutes: getOsmRoutes,
  getRaspAp1Routes: getRaspAp1Routes,
  getSingleRoute: getSingleRoute
};