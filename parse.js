var request = require('request');
var model = require('./model');
var db = require('./save');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Bus = model.Bus;
var Relation = model.Relation;

var query = 'http://overpass-api.de/api/interpreter?data=[out:json];(node["highway"="bus_stop"]["bus"="yes"](53.61776477868735,23.714332580566406,53.7450563448116,23.971824645996094);<;);out meta;';

var parametr = '[public_transport=platform]'; //мб понадобится

request(query, function (err, res, page) {
   if(!err && res.statusCode==200){

       var data = JSON.parse(page);
       var bus_stop = data.elements;

       bus_stop.forEach(function (item) {

          Bus.findOne({id: item.id}, function(error, elem){
            if(elem!=null){
              console.log("this ID:  "+elem.id+" exist");
            }else if(item.type == "node"){
              var tags = item.tags;

               bus = new Bus({
                   id: item.id,
                   name: tags.name,
                   lat: item.lat,
                   lon: item.lon
                 });

                db.add(bus);

            }

            });

            Relation.findOne({id: item.id}, function (error, elem) {
              if(elem!=null){
                console.log("relation already exist");
              }else if(item.type=="relation"){

                var tags = item.tags;
                var members = item.members;

                var mass= [];

                members.forEach(function(elem) {
                  if(elem.role=="platform"){
                    mass.push(Math.ceil(elem.ref));
                  }
                });

                mass.forEach(function(elem) {


                });

                relation = new Relation({
                id: item.id,
                from: tags.from,
                to: tags.to,
                number: tags.ref,
                type: tags.route,
                route:mass
                });


                  db.addRel(relation);





              }

            });


       });

   }
});
