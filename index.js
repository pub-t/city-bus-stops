var ap1 = require('./rasp.ap1');
var osm = require('./osm');

ap1.getSingleRoute();
ap1.getRaspAp1Routes();
ap1.getRaspAp1BusStops();

osm.getOsmBusStops();
osm.getOsmRoutes();
