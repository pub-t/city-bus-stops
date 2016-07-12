var request = require('request');
var expect = require('chai').expect;
var fetchCityBusStops = require('../osm').fetchCityBusStops;
var transformToGeoJson = require('../transformNodesToGeoJson');
var isStream = require('isstream');

describe('Check fetchCityBusStops', function () {
  it('should return stream', function () {
    var busStopsStream = fetchCityBusStops('Hrodna');
    expect(isStream(busStopsStream)).to.true;
    });
  it('should contain uri key', function () {
    var busStopsStream = fetchCityBusStops('Hrodna');
    expect(busStopsStream).to.include.keys('uri');
  });
});

describe('Check transformToGeoJson', function () {
  var busStopsStream = fetchCityBusStops('Hrodna');
  var transformStream = busStopsStream.pipe(transformToGeoJson);
  it('should return stream', function () {
    expect(isStream(transformStream)).to.true;
  });

  it('should be readable stream', function () {
    var busStopsStream = fetchCityBusStops('Hrodna');
    var transformStream = busStopsStream.pipe(transformToGeoJson);
    expect(transformStream).to.have.any.keys('readable', true);
  });

  it('should be writable stream', function () {
    var busStopsStream = fetchCityBusStops('Hrodna');
    var transformStream = busStopsStream.pipe(transformToGeoJson);
    expect(transformStream).to.have.any.keys('writable', true);
  })
});