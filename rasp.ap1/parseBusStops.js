var util = require('util');
var Duplex = require('stream').Duplex;
var cheerio = require('cheerio');

function parseCityBusStops(options) {
  if (!(this instanceof parseCityBusStops)) {
    return new parseCityBusStops(options)
  }
  Duplex.call(this, options);
  this.buffer = [];
  this.writeFlag = false;
}

util.inherits(parseCityBusStops, Duplex);

parseCityBusStops.prototype._read = function readBytes(n) {
};

parseCityBusStops.prototype._write = function (chunk, enc, cb) {
  if (this.writeFlag === true) {
    this.push(chunk);
    this.buffer = [];
  } else {
    this.buffer = Buffer.concat([new Buffer(this.buffer), new Buffer(chunk)]);
  }
  cb();
};

function parseBusStops(data) {
  var busStops = [];
  var busStopName;
  var link;

  data = cheerio.load(data);

  data('li.stoppoint').each(function () {
    var a = data(this).prev().children('a');
    if (a.attr('title') && a.attr('href')) {
      busStopName = a.attr('title').trim();
      link = a.attr('href').trim();
      busStops.push(
        {
          busStopName: busStopName,
          link: link
        }
      );
    }
  });
  return JSON.stringify(busStops);
}

var parseCityBusStopsObject = new parseCityBusStops();
parseCityBusStopsObject
  .on('finish', function () {
    parseCityBusStopsObject.buffer = parseBusStops(parseCityBusStopsObject.buffer);
    parseCityBusStopsObject.writeFlag = true;
    parseCityBusStopsObject.write(parseCityBusStopsObject.buffer.toString());
  });

module.exports = parseCityBusStopsObject;
