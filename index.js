const osm = require('./osm');
const fs = require('fs');

osm('Hrodna', log);

function log(data) {
  console.log(data)

}
