'use strict';

/**
 * Module for handling storage
 */
gsc.location = (function() {

  /**
   *
   * @exports gsc/location
   */
  var mod = {};

  /**
   * Create a new instance of a Location object
   *
   * @property {String} name - Name of location
   * @property {Number} lon - Longitude in SRS EPSG:4326
   * @property {Number} lat - Latitiude in SRS EPSG:4326
   * @param {String} name - User specified name of location
   * @param {Number} lon - User specified longitude in SRS EPSG:4326
   * @param {Number} lat - User specified latitude in SRS EPSG:4326
   * @class An object that defines the properties of a Location
   */
  mod.Location = function(name, lon, lat) {
    this.name = name;
    this.lon = lon;
    this.lat = lat;

    /**
     * Return a GeoJson feature object representing the current location
     *
     * @returns {GeoJSON.Feature}
     */
    this.asGeoJSON = function() {
      return {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [this.lon, this.lat]
        },
        'properties': {
          'name': this.name
        }
      };
    };
  };

  /**
   * Add a new location to a users profile
   *
   * @param {gsc.location.Location} location - A location definition create by instantiating the {@link Location} class
   * @returns {module:gsc/location.Location} - A {@link module:gsc/location.Location} object with the data of the added Location
   */
  mod.addLocation = function(location) {
    return gsc.doPost('addLocation', {
      location: location
    });
  };

  /**
   * Remove a location from a users profile
   *
   * @param {gsc.location.Location} location - A location definition create by instantiating the {@link Location} class
   * @returns {module:gsc/location.Location} - A gsc.location.Location object with the data of the removed location
   */
  mod.removeLocation = function(location) {
    return gsc.doPost('removeLocation', {
      location: location
    });
  };

  /**
   * Return all the locations stored under a users account as a list
   *
   * @returns {gsc.Response.<gsc.Response>} - An array of {@link: module:gsc/location.Location} objects wrapped in a gsc.Response object
   */
  mod.getLocationList = function() {
    return gsc.doPost('getLocationList');
  };

  /**
   * Adds a panel on top of an OpenLayers 3 map object that displays information about saved locations for the currently logged in user
   *
   * @param {ol.Map} openLayersMap - OpenLayers3 ol.Map object
   */
  mod.locationListWidget = function(openLayersMap) {

    var listPanel = document.createElement('div');
    mod.getLocationList()
            .then(function(locationListResponse) {
              var list = locationListResponse.data;
              for (var i = 0; i < list.length; i++) {
                var listItem = document.createElement('div');
                listItem.innerHtml = list[i].name;
                listItem.addEventListener('click', drawLocation, false);
                listPanel.appendChild(listItem);
              }
            }, function(err) {
              console.debug('An error occurred while loading saved locations:' +
                  err);
            });

    var drawLocation = function(location) {
      var pos = new ol.Feature();

      pos.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          fill: new ol.style.Fill({
            color: '#3399CC'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2
          })
        })
      }));

      pos.setGeometry([location.lon, location.lat]);
    };

    var locationListWidget = new ol.control.Control({
      element: listPanel
    });

    openLayersMap.addControl(locationListWidget);
  };

  return mod;

}());
