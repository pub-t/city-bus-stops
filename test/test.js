var request = require('request');
var expect = require('chai').expect;
var fetchCityBusStops = require('../osm/osm').fetchCityBusStops;
var transformToGeoJson = require('../osm/transformNodesToGeoJson')();
var isStream = require('isstream');
var nconf = require('../config');

describe('Result of the fetchCityBusStops function', function () {
  it('should be a stream', function () {
    var busStopsStream = fetchCityBusStops('Hrodna', nconf.get('requestOptions'));
    expect(isStream(busStopsStream)).to.true;
    });
  it('should contain field "URI"', function () {
    var busStopsStream = fetchCityBusStops('Hrodna', nconf.get('requestOptions'));
    expect(busStopsStream).to.include.keys('uri');
  });
});

describe('Result of the transformToGeoJson function', function () {
  var busStopsStream = fetchCityBusStops('Hrodna', nconf.get('requestOptions'));
  var transformStream = busStopsStream.pipe(transformToGeoJson);
  it('should return stream', function () {
    expect(isStream(transformStream)).to.true;
  });

  it('should be readable stream', function () {
    var busStopsStream = fetchCityBusStops('Hrodna', nconf.get('requestOptions'));
    var transformStream = busStopsStream.pipe(transformToGeoJson);
    expect(transformStream).to.have.any.keys('readable', true);
  });

  it('should be writable stream', function () {
    var busStopsStream = fetchCityBusStops('Hrodna', nconf.get('requestOptions'));
    var transformStream = busStopsStream.pipe(transformToGeoJson);
    expect(transformStream).to.have.any.keys('writable', true);
  })
});
