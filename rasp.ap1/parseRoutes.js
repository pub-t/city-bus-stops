var util = require('util');
var Duplex = require('stream').Duplex;
var cheerio = require('cheerio');

function ParseRoutes(options) {
  if (!(this instanceof ParseRoutes)) {
    return new ParseRoutes(options)
  }
  Duplex.call(this, options);
  this.buffer = [];
  this.writeFlag = false;
  this.on('finish', function () {
    this.buffer = parseRoutes(this.buffer);
    this.writeFlag = true;
    this.write(this.buffer);
  })
}

util.inherits(ParseRoutes, Duplex);

ParseRoutes.prototype._read = function readBytes(n) {};

ParseRoutes.prototype._write = function (chunk, enc, cb) {
  if (this.writeFlag === true) {
    this.push(chunk);
    this.buffer = [];
    this.writeFlag = false;
  } else {
    this.buffer = Buffer.concat([new Buffer(this.buffer), new Buffer(chunk)]);
  }
  cb();
};

function parseRoutes(data) {
  var routes = [];
  var routeName;
  var link;
  var number;

  var data = cheerio.load(data);
  data('#route_numbers_list').children('a').each(function () {
    var a = data(this);
    if (a.attr('title') && a.attr('href')) {
      routeName = a.attr('title').trim();
      link = a.attr('href').trim();
      number = a.text().trim();
      routes.push({
        routeName: routeName,
        number: number,
        link: link
      });
    }
  });

  return JSON.stringify(routes);
}

module.exports = ParseRoutes;
