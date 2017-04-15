var request = require('request');

var fetchCityBusStops = function (name, options) {
  var uri = 'http://overpass-api.de/api/interpreter?data=[out:json][timeout:25];area["place"="city"]' +
    '["name:en"="' + name + '"];(node["highway"="bus_stop"](area););out;';

  return request.get(uri, {
    timeout: options.time
  })
};

var fetchCityRoutes = function (name, options) {
  var uri = 'http://overpass-api.de/api/interpreter?data=[out:json][timeout:25];area["place"="city"]' +
    '["name:en"="' + name + '"];(node["highway"="bus_stop"]["bus"="yes"](area);<;>;);out;';

  return request.get(uri, {
    timeout: options.time
  })
};

module.exports = {
  fetchCityRoutes: fetchCityRoutes,
  fetchCityBusStops: fetchCityBusStops
};
