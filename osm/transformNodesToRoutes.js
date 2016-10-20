var util = require('util');
var Duplex = require('stream').Duplex;

function transformNodesToRoutes(options) {
  if (!(this instanceof transformNodesToRoutes)) {
    return new transformNodesToRoutes(options)
  }
  Duplex.call(this, options);
  this.buffer = [];
  this.readFlag = false;
  this.on('finish', function () {
    this.buffer = transformNodes(this.buffer);
    this.readFlag = true;
    this.write(this.buffer);
  });
}

util.inherits(transformNodesToRoutes, Duplex);

transformNodesToRoutes.prototype._read = function readBytes(n) {};

transformNodesToRoutes.prototype._write = function (chunk, enc, cb) {
  if (this.readFlag === true) {
    this.push(chunk);
    this.buffer = [];
    this.readFlag = false;
  } else {
    this.buffer = Buffer.concat([new Buffer(this.buffer), new Buffer(chunk)]);
  }
  cb();
};

function searchNode(id, nodes) {
  var name;

  for (var i = 0; i < nodes.elements.length; i++) {
    if (nodes.elements[i].type == "node" && nodes.elements[i].id == id) {
      name = nodes.elements[i].tags.name;
      return name;
    }
  }

  return name;
}

function saveRoute(routes, route) {
  var searchFlag = false;
  for (var i = 0; i < routes.length; i++) {
    if (routes[i].number == route.tags.ref) {
      routes[i].inner_routes.push(route);
      searchFlag = true;
    }
  }
  if (!searchFlag) {
    routes.push({
      number: route.tags.ref,
      inner_routes: [
        route
      ]
    });
  }
}

function searchBusStops(members, nodes) {
  var bus_stops = [];

  for (var j = 0; j < members.length; j++) {
    if (members[j].role == 'platform' || members[j].role == 'platform_exit_only') {
      var bus_stop = searchNode(members[j].ref, nodes);
      if (bus_stop != undefined) {
        bus_stops.push(bus_stop);
      }
    }
  }

  return bus_stops;
}

function transformNodes(data) {
  var routes = [];
  var nodes = JSON.parse(data);

  for (var i = 0; i < nodes.elements.length; i++) {
    if (nodes.elements[i].type == 'relation') {
      var bus_stops = searchBusStops(nodes.elements[i].members, nodes);

      var route = {
        id: nodes.elements[i].id,
        tags: nodes.elements[i].tags,
        bus_stops: {
          bus_stops_count: bus_stops.length,
          members: bus_stops
        }
      };

      saveRoute(routes, route);
    }
  }

  return JSON.stringify(routes);
}

module.exports = transformNodesToRoutes;
