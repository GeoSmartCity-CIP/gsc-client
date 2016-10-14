'use strict';

gsc.map = (function() {

  /**
   * @exports gsc/map
   */
  var mod = {};

  /** @type ol.map */
  mod.olMap = null;

  /** @type mapOptions */
  mod.mapOptions_ = null;

  var defaultMapOptions = {
    epsg: 'EPSG:3857',
    units: 'm'
  };

  /**
   * Create a map with standard functions (pan,zoom, view layers) and
   * other optional  specific functionality as info on feature and filter
   * on attributes
   *
   * @param {divObject} divObject is the map div
   * @param {mapOptions} mapOptions are the map options
   */
  mod.create = function(divObject, mapOptions) {
    mapOptions = jQuery.extend(defaultMapOptions, mapOptions || {});

    mod.mapOptions_ = mapOptions;

    mod.layers_ = mapOptions.layers || [];

    var projection = new ol.proj.Projection({
      code: mapOptions.epsg,
      units: mapOptions.units
    });

    mod.olMap = new ol.Map({
      controls: ol.control.defaults({
        attribution: false
      }),
      layers: mod.layers_,
      target: divObject,
      view: new ol.View({
        projection: projection
      })
    });

    if (mod.mapOptions_.bounds) {
      mod.olMap.getView().fit(mod.mapOptions_.bounds, mod.olMap.getSize());
    }
  };

  /**
   * Add layer to existing map
   *
   * @param {ol.layer} layer layer to show in map
   */
  mod.addLayer = function(layer) {
    mod.olMap.addLayer(layer);
    mod.layers_.push(layer);
  };

  /**
   * Return element of map viewport
   *
   * @return {element} DOM element of viewport
   */
  mod.getDomElement = function() {
    return $(mod.olMap.getViewport());
  };

  /**
   * Return ol map object
   *
   * @return {ol.map} map object
   */
  mod.getOlMap = function() {
    return mod.olMap;
  };

  /**
   * Redraw all layers
   *
   */
  mod.redraw = function() {
    mod.olMap.getLayers().forEach(function(lyr) {
      lyr.redraw();
    });
  };

  /**
   * Remove layer from map
   *
   */
  mod.removeLayer = function(layer) {
    mod.olMap.removeLayer(layer);
    mod.layers_ = mod.layers_.filter(function(value) {
      return value !== layer;
    });
  };

  /**
   * Fit to features
   *
   * @param {el.extent} bounds
   */
  mod.fit = function(bounds) {
    mod.olMap.getView().fit(bounds, mod.olMap.getSize());
  };

  mod.addMousePositionControl = function(location) {
    var mousePositionControl = new ol.control.MousePosition({
      className: 'custom-mouse-position',
      target: document.getElementById(location),
      coordinateFormat: ol.coordinate.createStringXY(5),
      undefinedHTML: '&nbsp;'
    });
    mod.olMap.addControl(mousePositionControl);
  };

  mod.addScaleBarControl = function(scalediv) {
    mod.olMap.getView().on('change:resolution', function(evt) {
      var resolution = evt.target.get('resolution');
      var units = mod.olMap.getView().getProjection().getUnits();
      var dpi = 25.4 / 0.28;
      var mpu = ol.proj.METERS_PER_UNIT[units];
      var scale = resolution * mpu * 39.37 * dpi;
      if (scale >= 9500 && scale <= 950000) {
        scale = Math.round(scale / 1000) + 'K';
      } else if (scale >= 950000) {
        scale = Math.round(scale / 1000000) + 'M';
      } else {
        scale = Math.round(scale);
      }
      document.getElementById(scalediv).innerHTML = 'Scale = 1 : ' + scale;
    });
    //fire change resolution event and restore previous configuration
    mod.olMap.getView().setZoom(mod.olMap.getView().getZoom() + 1);
    mod.olMap.getView().setZoom(mod.olMap.getView().getZoom() - 1);
  };

  mod.infoOnFeatureEvent = function(evt) {
    document.getElementById(this.nodelist).innerHTML = 'Loading... please ' +
        'wait...';
    var view = mod.olMap.getView();
    var viewResolution = view.getResolution();
    var source = this.layer.getSource();
    var url = source.getGetFeatureInfoUrl(
        evt.coordinate, viewResolution, view.getProjection(),
            {
              'INFO_FORMAT': 'text/html',
              'FEATURE_COUNT': this.maxFeaturesNumber
            });
    if (url) {
      document.getElementById(this.nodelist).innerHTML = '<iframe seamless ' +
          'src="' + url + '"></iframe>';
    }
  };

  /**
   * Adds info on feature event.
   *
   * @param {Object[]} nodelist
   * @param {Number} maxFeaturesNumber
   * @param {Object} layer
   */
  mod.addInfoOnFeatureEvent = function(nodelist, maxFeaturesNumber, layer) {
    var opts = {
      nodelist: nodelist,
      maxFeaturesNumber: maxFeaturesNumber,
      layer: layer
    };
    mod.olMap.on('singleclick', mod.infoOnFeatureEvent, opts);
  };

  mod.removeInfoOnFeatureEvent = function() {
    mod.olMap.on('singleclick', mod.infoOnFeatureEvent);
  };

  /**
   * Restricts displayed objects to those satisfying condition given by the filter parameter.
   *
   * @param {string} filterType Can be one of 'CQL', 'OGC' or 'FID'.
   * @param {string} filter Holds the filter expression in format given by filterType. For example 'ID=400'.
   */
  mod.filterOnAttributes = function(filterType, filter) {
    // by default, reset all filters
    var filterParams = {
      'FILTER': null,
      'CQL_FILTER': null,
      'FEATUREID': null
    };
    if (filter.replace(/^\s\s*/, '').replace(/\s\s*$/, '') !== '') {
      if (filterType === 'cql') {
        filterParams.CQL_FILTER = filter;
      }
      if (filterType === 'ogc') {
        filterParams.FILTER = filter;
      }
      if (filterType === 'fid') {
        filterParams.FEATUREID = filter;
      }
    }
    // merge the new filter definitions
    mod.olMap.getLayers().forEach(function(lyr) {
      lyr.getSource().updateParams(filterParams);
    });
  };

  mod.resetFilter = function() {
    mod.filterOnAttributes('cql', '');
  };

  return mod;

}());
