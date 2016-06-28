var request = require('request');

var fetchCityBusStops = function (name) {
 var uri = 'http://overpass-api.de/api/interpreter?data=[out:json][timeout:25];area["place"="city"]["name:en"="'+name+'"];(node["highway"="bus_stop"](area););out;';
 request(uri, function (err, res, body) {
	if(err){
	 console.error(err);
	}else {
	 var data = JSON.parse(body);
	 var bus_stop = data.elements;
	 bus_stop.forEach(function (elem) {
		console.log(elem);
	 });
	}
 });
};

fetchCityBusStops('Hrodna');