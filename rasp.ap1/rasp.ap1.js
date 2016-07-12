var request = require('request');

var loadCityBusStops = function (uri, options) {
  return request.get(uri, { timeout: options.time })
};

module.exports = {
  loadCityBusStops: loadCityBusStops
};
