'use strict';

var gsc = gsc || {};

gsc.routing = gsc.routing || {};

/**
 * Get a vector layer with the root
 *
 * @param {double} x1 coordinate of the start point
 * @param {double} y1 coordinate of the start point
 * @param {double} x2 coordinate of the end point
 * @param {double} y2 coordinate of the end point
 */
gsc.routing.routing = function(x1, y1, x2, y2) {

  var RoutingUrl = 'http:/hub.geosmartcity.eu' +
  //var RoutingUrl = 'http://localhost:8080' +
   '/GironaRouting/geo/RestService/getroute?';

  RoutingUrl += ('x1=' + x1 + '&y1=' + y1 + '&x2=' + x2 + '&y2=' +  y2);
  console.log(RoutingUrl);

  var	vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: RoutingUrl,
      format: new ol.format.GeoJSON()
    })
  });
  return vectorLayer;
};

