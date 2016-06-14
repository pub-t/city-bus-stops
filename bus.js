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
    id: {type:String, index:{unique:false}},
    name: String,
    lat: {type:Number, type:{unique:true}},
    lon: {type:Number, type:{unique:true}}
});



const Bus =  mongoose.model('Bus', busSchema);

module.exports = Bus;
