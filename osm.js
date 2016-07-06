var request = require('request');

var fetchCityBusStops = function (name) {
  var uri = 'http://overpass-api.de/api/interpreter?data=[out:json][timeout:25];area["place"="city"]' +
    '["name:en"="' + name + '"];(node["highway"="bus_stop"](area););out;';
  var req = request
    .get(uri, {timeout: 20000})
    .on('error', function (err) {
      if(err.code === 'ETIMEDOUT'){
        console.log('Error: (long request) ' + err.message);
      } else{
        console.log(err);
      }
    })
    .on('response', function (response) {
      console.log('Request status: ' + response.statusCode);
      console.log('Request type: ' + response.headers['content-type']);
    });
  return req;
};

module.exports= {
  fetchCityBusStops: fetchCityBusStops
};