var util = require('util');
var Duplex = require('stream').Duplex;
var cheerio = require('cheerio');

function ParseCityBusStops(options) {
  if (!(this instanceof ParseCityBusStops)) {
    return new ParseCityBusStops(options)
  }
  Duplex.call(this, options);
  this.buffer = [];
  this.writeFlag = false;
  this.on('finish', function () {
    this.buffer = parseBusStops(this.buffer);
    this.writeFlag = true;
    this.write(this.buffer.toString());
  })
}

util.inherits(ParseCityBusStops, Duplex);

ParseCityBusStops.prototype._read = function readBytes(n) {};

ParseCityBusStops.prototype._write = function (chunk, enc, cb) {
  if (this.writeFlag === true) {
    this.push(chunk);
    this.buffer = [];
    this.writeFlag = false;
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
      busStops.push({
        busStopName: busStopName,
        link: link
      });
    }
  });
  return JSON.stringify(busStops);
}

module.exports = ParseCityBusStops;
