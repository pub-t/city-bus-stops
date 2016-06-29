var request = require('request');
var expect = require('chai').expect;

var uri = 'http://overpass-api.de/api/interpreter?data=[out:json][timeout:25];area["place"="city"]["name:en"="Hrodna"];(node["highway"="bus_stop"](area););out;';
describe('check status request on overpass-api (city = Hrodna)', function(){
 it('should contain node with id 320409795',function(done){
	this.timeout(15000);
	request(uri, function(err, res, body){
	 var data = JSON.parse(body);
	 var bus_stops = data.elements;
	 bus_stops.forEach(function(elem) {
		expect(elem.id).to.equal(320409795);
		done();
	 });
	});
 })
});
