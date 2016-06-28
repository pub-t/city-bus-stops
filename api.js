const osm = require('./osm');
const busStopStream = osm.fetchCityBusStops('Hrodna');
var osmtogeojson = require('osmtogeojson')
var fs = require('fs');


var wstream = fs.createWriteStream('bus_stops.json');



busStopStream
    .pipe(wstream)
    .on('finish', function () {
     console.log('well done..');
    });