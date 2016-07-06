var request = require('request');
var expect = require('chai').expect;
var osm = require('../osm');
var busStopStream = osm.fetchCityBusStops;
var transformToGeoJson = require('../transformNodesToGeoJson');
var isStream = require('isstream');
var osmStream = busStopStream('Hrodna');

describe('Check the object returned from the fetchCityBusStops', function () {
  it('Should return stream', function () {
    expect(isStream(osmStream)).to.true;
    });
  it('should contain uri key', function () {
    expect(osmStream).to.include.keys('uri');
  });
});

describe('Check the object returned from the transformToGeoJson', function () {

  var transformStream = osmStream.pipe(transformToGeoJson);
  it('Should return stream', function () {
    expect(isStream(transformStream)).to.true;
  });

  it('Shoud contain flush property', function () {
    expect(transformStream).to.include.keys('_flush')
  })
});