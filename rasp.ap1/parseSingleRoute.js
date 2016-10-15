var util = require('util');
var Duplex = require('stream').Duplex;
var cheerio = require('cheerio');

function ParseSingleRoute(options) {
  if (!(this instanceof ParseSingleRoute)) {
    return new ParseSingleRoute(options)
  }
  Duplex.call(this, options);
  this.buffer = [];
  this.writeFlag = false;
  this.on('finish', function () {
    this.buffer = parseSingleRoute(this.buffer);
    this.writeFlag = true;
    this.write(this.buffer);
    this.buffer = [];
  })
}

util.inherits(ParseSingleRoute, Duplex);

ParseSingleRoute.prototype._read = function readBytes(n) {
};

ParseSingleRoute.prototype._write = function (chunk, enc, cb) {
  if (this.writeFlag === true) {
    this.push(chunk);
    this.buffer = [];
    this.writeFlag = false;
  } else {
    this.buffer = Buffer.concat([new Buffer(this.buffer), new Buffer(chunk)]);
  }
  cb();
};

function parseSingleRoute(data) {
  var routes = {};
  var bus_nubmer;

  data = cheerio.load(data);

  bus_nubmer = data('span.busicon').text().slice(1);
  data('.StopPointList').each(function () {
    var bus_stops = [];
    data(this).children('a').each(function () {
      bus_stops.push(data(this).text())
    });
    var route = {
      tags: {
        from: bus_stops[0],
        name: 'Атобус № ' +bus_nubmer + ': ' + bus_stops[0] + ' — ' + bus_stops[bus_stops.length-1],
        ref: bus_nubmer,
        route: 'bus',
        to: bus_stops[bus_stops.length-1]
      },
      bus_stops: {
        bus_stops_count: bus_stops.length,
        members: bus_stops
      }
    };

    Number(route.bus_stops.bus_stops_count) ? routes[route.tags.name] = route : '';
  });

  return JSON.stringify(routes);
}

module.exports = ParseSingleRoute;
