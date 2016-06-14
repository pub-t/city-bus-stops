var request = require('request');
var Bus = require('./bus');
var db = require('./save');
//var fs = require('fs');
//var jsonfile = require('jsonfile');

var query = 'http://overpass-api.de/api/interpreter?data=[out:json];node[highway=bus_stop][bus=yes](53.61776477868735,23.714332580566406,53.7450563448116,23.971824645996094);out;';

var parametr = '[public_transport=platform]'; //мб понадобится

request(query, function (err, res, page) {
   if(!err && res.statusCode==200){

       var data = JSON.parse(page);
       var bus_stop = data.elements;

       bus_stop.forEach(function (item, i) {

           var tags = item.tags;



               bus = new Bus({
                   name: tags.name,
                   lat: item.lat,
                   lon: item.lon
              //  });
               //
              //  var jsonBus = {
              //    "name": bus.name,
              //    "lat": bus.lat,
              //    "lon": bus.lon
              //  };
               //
               //
               //
              //   jsonfile.writeFileSync('bus_stop.json', jsonBus);


                db.add(bus);


               //console.log("BUS: " + bus.name + " CORD-> " + bus.lat + "/" + bus.lon);
               //console.log(jsonBus);


       });


   }
});
