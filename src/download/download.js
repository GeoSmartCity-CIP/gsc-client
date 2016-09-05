'use strict';

gsc.download = (function() {
  /**
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
   * @returns {string} .wkt string
   */
  mod.wkt = function() {
    var wkt = new ol.format.WKT();
    return wkt.writeFeatures(mod.selectedFeatures.getArray());
  };

  return mod;
}());
