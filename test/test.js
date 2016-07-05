var request = require('request');
var expect = require('chai').expect;
var osm = require('../osm');

describe('check status request on overpass-api (city = Hrodna)', function () {
  it('should contain node with id 320409795', function (done) {
    osm('Hrodno', function (body) {
      var data = JSON.parse(body);
      var bus_stops = data.elements;
      expect(bus_stops.length).to.not.equal(0);
      done();
    })
  }).timeout(5000);
});
