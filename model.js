var mongoose = require('mongoose');


var uristring = 'mongodb://localhost/bus_stop_v1';

mongoose.connect(uristring, function (error) {
    if (error) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + error);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});

var busSchema = new mongoose.Schema({
    id: {type:Number, index:{unique:true}},
    name: String,
    lat: {type:Number, type:{unique:true}},
    lon: {type:Number, type:{unique:true}}
});

var relationSchema = new mongoose.Schema({
    id: {type:Number, index:{unique:false}},
    from: String,
    to: String,
    number: String,
    type: String,
    route:[
      Number
    ]
});






var Bus =  mongoose.model('buses', busSchema);

var Relation =  mongoose.model('relations', relationSchema);

module.exports.Bus = Bus;
module.exports.Relation = Relation;
