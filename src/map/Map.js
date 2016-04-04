'use strict';

gsc.map = gsc.map || {};

/**
 * Create a map with standard functions (pan,zoom, view layers) and
 * other optional  specific functionality as info on feature and filter
 * on attributes
 *
 * @param {divObject} divObject is the map div
 * @param {mapOptions} mapOptions are the map options
 * @constructor
 */
gsc.map.Map = function(divObject, mapOptions) {
  var _self = this;

  this.layers_ = mapOptions.layers || [];

  var projection = new ol.proj.Projection({
    code: mapOptions.epsg,
    units: mapOptions.units
  });

  var olMap = new ol.Map({
    controls: ol.control.defaults({
          attribution: false
        }),
    layers: _self.layers_,
    target: divObject,
    view: new ol.View({
      projection: projection
    })
  });

  _self.addLayer = function(layer) {
    olMap.addLayer(layer);
    _self.layers_.push(layer);
  };

  _self.getDomElement = function() {
    return $(olMap.getViewport());
  };

  _self.getOlMap = function() {
    return olMap;
  };

  _self.redraw = function() {
    olMap.getLayers().forEach(function(lyr) {
      lyr.redraw();
    });
  };

  _self.removeLayer = function(layer) {
    olMap.removeLayer(layer);
    _self.layers_ = _self.layers_.filter(function(value) {
      return value !== layer;
    });
  };

  _self.fit = function(bounds) {
    olMap.getView().fit(bounds, olMap.getSize());
  };

  _self.addMousePositionControl = function(location) {
    var mousePositionControl = new ol.control.MousePosition({
        className: 'custom-mouse-position',
        target: document.getElementById(location),
        coordinateFormat: ol.coordinate.createStringXY(5),
        undefinedHTML: '&nbsp;'
      });
    olMap.addControl(mousePositionControl);
  };

  _self.addScaleBarControl = function(scalediv) {
    olMap.getView().on('change:resolution', function(evt) {
      var resolution = evt.target.get('resolution');
      var units = olMap.getView().getProjection().getUnits();
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
    olMap.getView().setZoom(olMap.getView().getZoom() + 1);
    olMap.getView().setZoom(olMap.getView().getZoom() - 1);
  };

  _self.infoOnFeatureEvent = function(evt) {
    document.getElementById(this.nodelist).innerHTML = 'Loading... please ' +
    'wait...';
    var view = olMap.getView();
    var viewResolution = view.getResolution();
    var source = this.layer.getSource();
    var url = source.getGetFeatureInfoUrl(
      evt.coordinate, viewResolution, view.getProjection(),
      {'INFO_FORMAT': 'text/html',
             'FEATURE_COUNT': this.maxFeaturesNumber
      });
    if (url) {
      document.getElementById(this.nodelist).innerHTML = '<iframe seamless ' +
      'src="' + url + '"></iframe>';
    }
  };

  _self.addInfoOnFeatureEvent = function(nodelist, maxFeaturesNumber, layer) {
    var opts = {
      nodelist: nodelist,
      maxFeaturesNumber: maxFeaturesNumber,
      layer: layer
    };
    olMap.on('singleclick', _self.infoOnFeatureEvent, opts);
  };

  _self.removeInfoOnFeatureEvent = function() {
    olMap.on('singleclick', _self.infoOnFeatureEvent);
  };

  if (mapOptions.bounds) {
    olMap.getView().fit(mapOptions.bounds, olMap.getSize());
  }

  _self.filterOnAttributes = function(filterType, filter) {

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
    olMap.getLayers().forEach(function(lyr) {
            lyr.getSource().updateParams(filterParams);
          });
  };

  _self.resetFilter = function() {
    _self.filterOnAttributes('cql','');
  };

  return _self;
};
