'use strict';

var gsc = gsc || {};

gsc.Report = gsc.Report || {};

gsc.ReportConst = {
  Formats: {
    'A4_landscape': 'A4 Landscape',
    'A4_portrait': 'A4 Portrait',
    'A3_landscape': 'A3 Landscape',
    'A3_portrait': 'A3 Portrait'
  }
};

/**
 * <p>Report object
 </p>
 * @class gsc.Report
 * @constructor
 * @param {gsc.map} [map] Map for printing
 * @param {gsc.ReportConst|String} [format] Size and orientation of report
 * @param {Number} [quality] Report quality (dpi's)
 */
gsc.Report = function(map, format, quality) {

  this._format = null;

  this._setFormat = function(format) {
    if (format) {

      //check if format is a string
      if (typeof format === 'string') {
        for (var f in gsc.ReportConst.Formats) {
          if (gsc.ReportConst.Formats[f] === format) {
            this._format = format;
          }
        }
        if (!this._format) {
          //TODO: Throw exception
          console.error('Format parameter not recognize');
          return;
        }
      } else {
        //TODO: Throw exception
        console.error('Format parameter not recognize');
        return;
      }
    } else {
      //the default format is A4 landscape
      this._format = 'A4_landscape';
    }
    this._paperSize = this._format.substring(0, this._format.indexOf(' '));
    this._paperOrientation =
	this._format.substring(this._format.indexOf(' ') + 1);
  };
  this._setMap = function(map) {
    if (!map) {
      //TODO: Throw exception
      console.error('Object Map not recognizes');
      return;
    }
    this._map = map;
  };
  this._setQuality = function(quality) {
    if (quality) {
      if (typeof (quality) !== 'number') {
        if (isNaN(parseInt(quality,10))) {
          //TODO: Throw exception
          console.error('Quality parameter not recognizes');
          return;
        }
        this._quality = parseInt(quality,10);
      } else {
        this._quality = quality;
      }
    } else {
      this._quality = 90;
    }
  };

  this._setFormat(format);
  this._setMap(map);
  this._setQuality(quality);

  this._ReportDimensions = {
    'landscape': {
      a0: [1189, 841],
      a1: [841, 594],
      a2: [594, 420],
      a3: [420, 297],
      a4: [297, 210],
      a5: [210, 148]
    },
    'portrait': {
      a0: [841,1189],
      a1: [594,841],
      a2: [420,594],
      a3: [297,420],
      a4: [210,297],
      a5: [148,210]
    }
  };
  this._dimensions =   this._ReportDimensions[
	this._paperOrientation.toLowerCase()][this._paperSize.toLowerCase()
	];
};

gsc.Report.prototype.Print = function(format, quality) {
  var report = this;
  var map = this._map;
  if (arguments.length > 0) {
    report._setFormat(format);
  }
  if (arguments.length > 1) {
    report._setQuality(quality);
  }
  this._dimensions = this._ReportDimensions
	[this._paperOrientation.toLowerCase()]
	[this._paperSize.toLowerCase()];
  var dim = this._dimensions;
  var olMap = map.getOlMap();
  var size = (olMap.getSize());
  var ratio = size[0] / size[1];
  var width = Math.round(dim[0] * this._quality / 25.4);
  var height = Math.round((dim[0] / ratio) * this._quality / 25.4);
  var extent = olMap.getView().calculateExtent(size);
  var tileCount = 0;

  olMap.once('postcompose', function(event) {
    var source = null;
    //tiled base layers
    if (this.getLayers().item(0) instanceof ol.layer.Tile) {
      var map = this;
      source = this.getLayers().item(0).getSource();

      var tileStartLoad = function() {tileCount++;};
      var tileEndLoad = function() {
        tileCount--;
        checkTiles();
      };
      var checkTiles = function() {
        if (tileCount === 0) {
          var canvas = event.context.canvas;
          setTimeout(function() {
            var data = canvas.toDataURL('image/png');
            // jscs:disable requireCapitalizedConstructors
            // jscs:disable maximumLineLength
            var pdf = new jsPDF(report._paperOrientation.toLowerCase(),'mm',report._paperSize.toLowerCase()); // jshint ignore:line
            // jscs:enable requireCapitalizedConstructors
            pdf.addImage(data,'PNG', 0,(dim[1] - Math.round(dim[0] / ratio)) / 2,dim[0], Math.round(dim[0] / ratio));
            // jscs:enable maximumLineLength
            pdf.save('map.pdf');
          },300);
          map.setSize(size);
          map.getView().fit(extent, size);
          map.renderSync();
          source.un('tileloadstart', tileStartLoad);
          source.un('tileloadend', tileEndLoad);
          source.un('tileloaderror', tileEndLoad);
        }
      };
      source.on('tileloadstart', tileStartLoad);
      source.on('tileloadend', tileEndLoad);
      source.on('tileloaderror', tileEndLoad);
    }
    //image base layers
    if (this.getLayers().item(0) instanceof ol.layer.Image) {
      source = this.getLayers().item(0).getSource();
      var ImageStartLoad = function() {
        console.log('resizing basemap');
      };
      var ImageEndLoad = function() {
        var canvas = event.context.canvas;
        var data = canvas.toDataURL('image/png');
        // jscs:disable requireCapitalizedConstructors
        // jscs:disable maximumLineLength
        var pdf = new jsPDF(report._paperOrientation.toLowerCase(),'mm',report._paperSize.toLowerCase()); // jshint ignore:line
        // jscs:enable requireCapitalizedConstructors
        pdf.addImage(data,'PNG',0,(dim[1] - Math.round(dim[0] / ratio)) / 2, dim[0], Math.round(dim[0] / ratio));
        // jscs:enable maximumLineLength
        pdf.save('map.pdf');
        map.setSize(size);
        map.getView().fit(extent, size);
        map.renderSync();
        source.un('imageloadstart', ImageStartLoad);
        source.un('imageloadend', ImageEndLoad);
        source.un('imageloaderror', ImageEndLoad);
      };
      source.on('imageloadstart', ImageStartLoad);
      source.on('imageloadend', ImageEndLoad);
      source.on('imageloaderror', ImageEndLoad);
    }
  });
  olMap.setSize([width, height]);
  olMap.getView().fit(extent,  (olMap.getSize()));
  olMap.renderSync();
};
