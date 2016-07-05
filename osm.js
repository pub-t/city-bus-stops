var request = require('request');
var osmtogeojson = require('osmtogeojson');
var fs = require('fs');
var wstream = fs.createWriteStream('bus_stops.json');

var fetchCityBusStops = function (name, cb) {
  var uri = 'http://overpass-api.de/api/interpreter?data=[out:json][timeout:25];area["place"="city"]["name:en"="' + name + '"];(node["highway"="bus_stop"](area););out;';
  var data;
  request(uri, function (error, response, body) {
    data = JSON.parse(body.toString());

    if (!error && response.statusCode == 200 && data.elements.length !== 0) {
      cb(data);
    } else {
      var fetchError = new Error('Problem with fetching data(bad name)');
      fetchError.statusCode = 500;
      cb(fetchError)
    }
  })
    .pipe(wstream);
};

module.exports = fetchCityBusStops;