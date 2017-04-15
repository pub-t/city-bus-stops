var request = require('request');
var expect = require('chai').expect;
var fetchCityBusStops = require('../osm/osmRequests').fetchCityBusStops;
var transformToGeoJson = require('../osm/transformNodesToGeoJson')();
var stream = require('stream').Stream;
var config = require('../config').get('requestOptions');

describe('Result of the fetchCityBusStops function', function () {
  it('should be a stream', function () {
    var busStopsStream = fetchCityBusStops('Hrodna', config);
    expect(busStopsStream).to.be.an.instanceOf(stream);
  });
  it('should contain field "URI"', function () {
    var busStopsStream = fetchCityBusStops('Hrodna', config);
    expect(busStopsStream).to.include.keys('uri');
  });
});

describe('Result of the transformToGeoJson function', function () {
  var busStopsStream = fetchCityBusStops('Hrodna', config);
  var transformStream = busStopsStream.pipe(transformToGeoJson);
  it('should return stream', function () {
    expect(transformStream).to.be.an.instanceOf(stream);
  });

  it('should be readable stream', function () {
    var busStopsStream = fetchCityBusStops('Hrodna', config);
    var transformStream = busStopsStream.pipe(transformToGeoJson);
    expect(transformStream).to.have.any.keys('readable', true);
  });

  it('should be writable stream', function () {
    var busStopsStream = fetchCityBusStops('Hrodna', config);
    var transformStream = busStopsStream.pipe(transformToGeoJson);
    expect(transformStream).to.have.any.keys('writable', true);
  })
});
