var request = require('request');

var loadCityBusStops = function (uri, time) {
  return request.get(uri, {timeout: time})
};

module.exports = {
  loadCityBusStops: loadCityBusStops
};