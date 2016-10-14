'use strict';

var gsc = gsc || {};

gsc.routing = (function() {

  /**
   * This module
   * @exports gsc/routing
   */
  var mod = {};

  /**
   * Create a new instance of a Route object
   *
   * @class - A class that represents a calculated route with a start and an end point
   * @property {String} name - A descriptive name that the route will be saved under. Will also be used in the route list.
   * @property {ol.geom.Point} startingPoint - A geojson object that defines a route
   * @property {ol.geom.Point} endPoint - A geojson object that defines a route
   * @property {Number} distance - A geojson object that defines a route
   * @property {GeoJSON.FeatureCollection} segments - A geojson FeatureCollection object that defines the segments of the route
   * @param {String} name - A descriptive name that the route will be saved under. Will also be used in the route list.
   * @param {ol.geom.Point} startingPoint - The longitude/latitude pair that defines the start of the route
   * @param {ol.geom.Point} endPoint - The longitude/latitude pair that defines the end point of the route
   * @param {Number} distance - A geojson object that defines a route
   * @param {GeoJSON.FeatureCollection} segments - A geojson FeatureCollection object that defines the segments of the route
   * @example <caption>Create a new instance of the .Route object</caption>
   * var point1 = new ol.geom.Point(1,1);
   * var point2 = new ol.geom.Point(2,2);
   * var route = new gsc.routing.Route('A to B', point1, point2, 112, routeGeoJson);
   */
  mod.Route = function(name, startingPoint, endPoint, distance, segments) {

  };

  mod.Request = function(url) {
    return jQuery.ajax({
      method: 'GET',
      url: url,
      //dataType: 'application/json',
      //crossDomain: true
    });
  };

  /**
   * Get a vector layer with displaying a route
   *
   * @param {double} lon1 - Longitiude of start point
   * @param {double} lat1 - Latitude of the start point
   * @param {double} lon2 - Longitude of the end point
   * @param {double} lat2 - Latitude of the end point
   * @returns {ol.layer.Vector} - The route as a GeoJSON object
   * @example <caption>Calculate a route</caption>
   * gsc.routing.calculateRoute(2.8214,41.9794,2.8314,41.9694)
   *      .then(function(routeResponse) {
   *          var vectorLayer = routeResponse;
   *          // Do something with the vector layer - typically add it to an OpenLayers map
   *      }, function(err) {
   *          // An error occurred
   *          console.debug('Could not calculate route: ' + err);
   *      });
   */
  mod.calculateRoute = function(lon1, lat1, lon2, lat2) {

    var dfd = jQuery.Deferred();

    var routingUrl = 'http://hub.geosmartcity.eu/' +
        'GironaRouting/geo/RestService/getroute?';

    routingUrl += ('x1=' + lon1 + '&y1=' + lat1 +
        '&x2=' + lon2 + '&y2=' + lat2);

    var defaultStyles = {
      'LineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'green',
          width: 5
        })
      }),
      'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'green',
          width: 5
        })
      })
    };

    var defaultStyleFunction = function(feature) {
      return defaultStyles[feature.getGeometry().getType()];
    };

    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: routingUrl,
        format: new ol.format.GeoJSON(),
        style: defaultStyleFunction
      })
    });

    dfd.resolve(vectorLayer);

    return dfd;
  };

  /**
   * Alias for calculateRoute
   * @deprecated
   */
  mod.routing = mod.calculateRoute;

  /**
   * Persistently stores a route associated with the user id of the currently logged in user
   *
   * @param {gsc.routing.Route} route - The route to add
   * @returns {gsc.Response}
   * @example <caption>Save a route</caption>
   * gsc.user.login() // All requests must take place inside a valid user session
   *      .then(function(success)) {
   *          var r = new gsc.routing.Route();
   *          gsc.routing.addRoute(r)
   *              .then(function(routeResponse) {
   *                  var addedRoute = routeResponse.data;
   *                  // Do something with the saved route
   *              }, function(err) {
   *                  // Could not save the route
   *                  console.debug('Could not save route: ' + err);
   *              });
   *      }, function(err) {
   *          // Could not login user
   *          console.debug('Could not authenticate user: ' + err);
   *      );
   */
  mod.addRoute = function(route) {
    return gsc.doPost('addRoute', {
      route: route
    });
  };

  /**
   * Remove a stored route from the account of the currently logged in user
   *
   * @param {gsc.routing.Route} route - The route object to remove
   * @returns {Promise.<gsc.Response>} - A gsc.routing.Route object wrapped in a gsc.Response
   * @example <caption>Remove a saved route</caption>
   * gsc.routing,getRouteList() // Load the existing routes
   *      .then(function(routeList) {
   *
   *          // Pick a route to remove, must check if list has elements...
   *          var routeToRemove = routeList[0];
   *
   *          gsc.routing.removeRoute(routeToRemove)
   *              .then(function(removeRouteResponse) {
   *                  var removedRoute = removeRouteResponse.data;
   *                  // Do something with the removed route
   *              }, function(err) {
   *                  // Handle error
   *                  console.debug('An error occurred while removing route: ' + err);
   *              });
   *      }, function(err) {
   *          // Handle error
   *          console.debug('User authentication failed: ' + err);
   *      });
   */

  mod.removeRoute = function(route) {
    return gsc.doPost('removeRoute', {
      route: route
    });
  };

  /**
   * Retrieves a list of all stored routes for the currently logged in user
   *
   * @returns {gsc.Response} - An array of {@link gsc/storage.Route} objects wrapped in a standard
   * {@link gsc.Response} web service response object
   * @example <caption>Get list of the route saved for the current user</caption>
   * gsc.routing.getRouteList()
   *      .then(function(routeListResponse) {
   *          var routeList = routeListResponse.data;
   *          // Do something with the route
   *      }, function(err) {
   *          // An error occurred, handle it
   *          console.debug('Err');
   *      });
   */
  mod.getRouteList = function() {
    return gsc.doPost('getRouteList');
  };

  /**
   * Adds a widget on top of an Open Layers 3 map object
   *
   * @param {ol.Map} olMap - A pre-existing and initialized OpenLayers 3 Map object
   * @example <caption>Add a route list widget to an existing OpenLayers map object</caption>
   *
   * var olMap = new ol.Map({
   *      // Map creation options
   * });
   *
   * gsc.routing.savedRouteListWidget(olMap);
   *
   */
  mod.savedRouteListWidget = function(olMap) {

  };

  /**
   * Display a calculated route on top of an existing OpenLayers3 map object instance
   *
   * @param {gsc.routing.Route} route - Route data object as returned by routing service
   * @param {ol.Map} olMap - A pre-existing and initialized OpenLayers 3 Map object
   * @example <caption>Add a route list widget to an existing OpenLayers map object</caption>
   * // First instantiate a map (shown simplified here, for details, please refer to OpenLayers docs)
   * var olMap = new ol.Map({
   *      // Map creation options
   * });
   *
   * // Then simply add the widget on top of the map object using this static method
   * gsc.routing.viewRouteWidget(olMap);
   *
   */
  mod.viewRouteWidget = function(route, olMap) {

  };

  return mod;
}());

