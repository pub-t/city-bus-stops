var request = require('request');

var fetchCityBusStops = function (name) {
  var uri = 'http://overpass-api.de/api/interpreter?data=[out:json][timeout:25];area["place"="city"]' +
    '["name:en"="' + name + '"];(node["highway"="bus_stop"](area););out;';
  var time = 20000;

  return request.get(uri, {timeout: time})
};

module.exports = {
  fetchCityBusStops: fetchCityBusStops
};