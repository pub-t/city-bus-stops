var request = require('request');
var expect = require('chai').expect;
var osm = require('../osm');
var busStopStream = osm.fetchCityBusStops('Hrodna');

describe('check return object of fetchCityBusStops function ', function () {
  it('should return request object', function () {
    var obj = busStopStream;
    expect(obj).to.be.an('object');
    });
  it('should contain uri key', function () {
    var obj = busStopStream;
    expect(obj).to.include.keys('uri');
  });
});
