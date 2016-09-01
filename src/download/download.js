'use strict';

var gsc = gsc || {};

gsc.download = (function() {

  /**
   * Module that implements functions to download data files for offline/desktop use
   *
   * @exports gsc/download
   */
  var mod = {};

  /** @type ol.Map */
  mod.olMap = null;

  /** @type ol.Layer */
  mod.layer = null;

  /** @type Array.<ol.Feature> */
  mod.selectedFeatures = null;

  /** @type ol.interaction.Select */
  mod.select = null;

  /** @type ol.interaction.DragBox */
  mod.dragBox = null;

  mod.create = function(map, layer) {
    mod.olMap = map;
    mod.layer = layer;
    mod.select = new ol.interaction.Select();
    mod.olMap.addInteraction(mod.select);
    mod.selectedFeatures = mod.select.getFeatures();
    mod.dragBox = new ol.interaction.DragBox({
      condition: ol.events.condition.platformModifierKeyOnly,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: [0, 0, 255, 1]
        })
      })
    });
    mod.olMap.addInteraction(mod.dragBox);

    mod.dragBox.on('boxend', function() {
      var extent = mod.dragBox.getGeometry().getExtent();
      mod.layer.getSource().forEachFeatureIntersectingExtent(
                extent, function(feature) {
                  mod.selectedFeatures.push(feature);
                });
    });

    mod.dragBox.on('boxstart', function() {
      mod.selectedFeatures.clear();
    });
    mod.olMap.on('click', function() {
      mod.selectedFeatures.clear();
    });
  };

  mod.addLayer = function(layer) {
    mod.removeLayer();
    mod.layer = layer;
  };

  mod.removeLayer = function() {
    mod.layer = null;
  };

  /**
   * @returns {string} .kml string
   */
  mod.kml = function() {
    var kml = new ol.format.KML();
    return kml.writeFeatures(mod.selectedFeatures.getArray());
  };

  /**
   * @param {ol.format.GML} gml
   * @returns {string} .gml string
   */
  mod.gml = function(gml) {
    return gml.writeFeatures(mod.selectedFeatures.getArray());
  };

  /**
   * @returns {string} .gpx string
   */
  mod.gpx = function() {
    var gpx = new ol.format.GPX();
    return gpx.writeFeatures(mod.selectedFeatures.getArray());
  };

  /**
   * @returns {string} .json string
   */
  mod.json = function() {
    var json = new ol.format.GeoJSON();
    return json.writeFeatures(mod.selectedFeatures.getArray());
  };

  /**
   * URL to WFS Server
   *
   * @private
   * @type String
   */
  var _wfs = null;

  /**
   * Set the URL of the WFS server to use
   *
   * @param {String} wfsUrl
   */
  mod.setWFSServer = function(wfsUrl) {
    gsc.setWFSServer(wfsUrl);
    return;
  };

  /**
   * Download a layer in a specific format
   *
   * @param {type} layerId - Identifier of the layer in the specified WFS server
   * @param {String} format - One of 'kml', 'geojson'
   * @param {String} [contentDisposition=null] - If set to 'attachment' will trigger a download in the client
   * @returns {Promise.<gsc.Response>}
   * @example <caption>Download a file with choice - trigger a save file dialogue in the client</caption>
   * gsc.download.getFile('abcd1', 'geojson', 'attachment') // Assuming the configured WFS server has a layer with this identifier
   *      .then(function(downloadResponse) {
   *          var fileData = downloadResponse.data;
   *          // Do something with the downloaded data
   *      }, function(err) {
   *          // Handle error
   *      });
   */
  mod.getFile = function(layerId, format, contentDisposition) {
    if (contentDisposition === undefined) {
      contentDisposition = null;
    }

    return gsc.doPost('download.getFile', {
      layerId: layerId,
      format: format,
      contentDisposition: contentDisposition
    });
  };

  /**
   * Download a layer as KML. Convenience method.
   *
   * @param {String} layerId - Identifier of layer to downloar
   * @returns {Promise.<gsc.Response>} - The file data wrapped in a gsc.Response object
   * @example <caption>Download a file as GeoJSON</caption>
   * gsc.download.getKML('abcd1') // Assuming the configured WFS server has a layer with this identifier
   *      .then(function(downloadResponse) {
   *          var fileData = downloadResponse.data;
   *          // Do something with the downloaded data
   *      }, function(err) {
   *          // Handle error
   *      });
   */
  mod.getKML = function(layerId) {
    return mod.getFile(layerId, 'geojson');
  };

  /**
   * Download a layer as GeoJSON. Convenience method.
   *
   * @param {String} layerId - Identifier of layer to downloar
   * @returns {Promise.<gsc.Response>} - The file data wrapped in a gsc.Response object
   * @example <caption>Download a file as GeoJSON</caption>
   * gsc.download.getGeoJSON('abcd1')  // Assuming the configured WFS server has a layer with this identifier
   *      .then(function(downloadResponse) {
   *          var fileData = downloadResponse.data;
   *          // Do something with the downloaded data
   *      }, function(err) {
   *          // Handle error
   *      });
   */
  mod.getGeoJSON = function(layerId) {
    return mod.getFile(layerId, 'geojson');
  };

  /**
   * @returns {string} .wkt string
   */
  mod.wkt = function() {
    var wkt = new ol.format.WKT();
    return wkt.writeFeatures(mod.selectedFeatures.getArray());
  };

  return mod;
}());
