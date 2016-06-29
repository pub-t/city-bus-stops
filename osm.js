var request = require('request');
var osmtogeojson = require('osmtogeojson');
var fs = require('fs');
var wstream = fs.createWriteStream('bus_stops.json');

var fetchCityBusStops = function (name) {
 var uri = 'http://overpass-api.de/api/interpreter?data=[out:json][timeout:25];area["place"="city"]["name:en"="'+name+'"];(node["highway"="bus_stop"](area););out;';
 request(uri, function (err, res, doc) {
  if(err){
   console.error(err);
  }else {
   var data = JSON.parse(doc);
   var newData = JSON.stringify(osmtogeojson(data));
   save(newData);
  }
 });
};

var save = function (data) {

 wstream.write(data);
 wstream.end();

 wstream.on('finish', function() {
  console.log("well done, bus stops add in bus_stops.json");
 });

 wstream.on('error', function(err){
  console.log(err.stack);
 });
};

//enter the name of the city in english (Hrodna, Minsk..)
fetchCityBusStops('Hrodna');