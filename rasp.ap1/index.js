var nconf = require('../config');
var raspAp1 = require('./rasp.ap1Requests.js');
var fs = require('fs');
var log = require('bunyan').createLogger(nconf.get('logOptions'));
var async = require('async');
var through = require('through2');

//rasp.ap1 Streams
var raspAp1Stream = raspAp1(nconf.get('rasp.ap1_url'), nconf.get('requestOptions'));
var raspAp1SingleRouteStream = raspAp1('http://rasp.ap1.by/routedetails.php?rno=1',
  nconf.get('requestOptions'));

//Parsers
var parseBusStops = require('./parseBusStops')();
var parseRoutes = require('./parseRoutes')();
var parseSingleRoute = require('./parseSingleRoute');

//Output files
var raspAp1BusStopsStream = fs.createWriteStream('./busStops/raspAp1BusStops.json');
var raspAp1RoutesStream = fs.createWriteStream('./busStops/raspAp1Routes.json');
var raspAp1SingleRoute = fs.createWriteStream(('./busStops/raspAp1SingleRoute.json'));

//Error handler
function handleError(error) {
  log.error(error.name + ': ' + error.message);
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

function getRaspAp1Routes() {
  raspAp1Stream
    .on('error', handleError)
    .on('response', function (response) {
      log.info(response.statusCode);
    })
    .pipe(parseRoutes)
    .on('error', handleError)
    .pipe(through(function (data, enc, cb) {
      var routes = [];
      var array = JSON.parse(data.toString());
      var self = this;

      async.forEachOf(array, function (item, key, asyncCallBack) {
        raspAp1(nconf.get('rasp.ap1_url') + item.link, nconf.get('requestOptions'))
          .pipe(parseSingleRoute())
          .pipe(through(function (chunk, enc, cb) {
            var obj = JSON.parse(chunk.toString());
            routes.push(obj);

            cb();
            asyncCallBack();
          }));

      }, function (err) {
        if(err) throw err;

        self.push(JSON.stringify(routes));
        cb();
      });
    }))
    .on('error', handleError)
    .pipe(raspAp1RoutesStream)
    .on('error', handleError);
}

function getSingleRoute() {
  raspAp1SingleRouteStream
    .on('error', handleError)
    .on('response', function (response) {
      log.info(response.statusCode);
    })
    .pipe(parseSingleRoute())
    .on('error', handleError)
    .pipe(raspAp1SingleRoute)
    .on('error', handleError);
}

module.exports = {
  getRaspAp1BusStops: getRaspAp1BusStops,
  getRaspAp1Routes: getRaspAp1Routes,
  getSingleRoute: getSingleRoute
};
