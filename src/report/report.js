'use strict';

var gsc = gsc || {};

gsc.Report = gsc.Report || {};

gsc.ReportConst = {
  Formats: {
    'A4_landscape': 'A4 Landscape',
    'A4_portrait': 'A4 Portrait',
    'A3_landscape': 'A3 Landscape',
    'A3_portrait': 'A3 Portrait'
  },
  ObjectType: {
    'Image': 'Image',
    'Text': 'Text',
    'Date': 'Date',
    'Scale': 'Scale',
    'DOM': 'DOM'
  },
  VerticalAlign: {
    'Top': 'TOP',
    'Bottom': 'BOTTOM'
  },
  HorizontalAlign: {
    'Left': 'LEFT',
    'Right': 'RIGHT',
    'Center': 'CENTER'
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
gsc.Report = function(map, format, quality, options) {
  this._format = null;
  this._default = {
    margin: [10],
    content: null
  };
  this._options = null;
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

  this._setOptions = function(options) {
    if (options) {
      this._options = options;
      if (!options.margin || !(options.margin instanceof Array)) {
        this._options.margin = this._default.margin;
      }
    } else {
      this._options = this._default;
    }
  };
  this._setFormat(format);
  this._setMap(map);
  this._setQuality(quality);
  this._setOptions(options);

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
  this._addImage = function(pdf, data, dim, ratio) {
    var margin = this._getMargins();

    pdf.addImage(data,'PNG',
		margin.left,
		margin.top,
        dim[0] - margin.left - margin.right,
        Math.round((dim[0] - margin.left - margin.right) / ratio));
  };
  this._getMargins = function() {
    var margin = {
      left: this._options.margin[this._options.margin.length - 1],
      right: (this._options.margin.length == 1 ?
      this._options.margin[0] : this._options.margin[1]),
      top: this._options.margin[0],
      bottom:
			this._options.margin[Math.min(2 ,this._options.margin.length - 1)]
    };
    return margin;
  };
  this._renderObject = function(pdf, object) {

    if (object) {
      switch (object.type){
        case gsc.ReportConst.ObjectType.Image:
          if (!object.data) {
            console.warn('Object of content report not defined data');
            return;
          }
          this._renderImage(pdf,object);

        break;
        case gsc.ReportConst.ObjectType.Text:
          if (!object.data) {
            console.warn('Object of content report not defined data');
            return;
          }
          this._renderText(pdf,object);
        break;
        default: //in default case render text

        break;
      }
    } else {
      console.warn('Object of content report not defined');
    }
  };
  this._renderImage = function(pdf, object) {
      var imgData = null;
      var w = object.width;
      var h = object.height;
      if (object.data.indexOf('data') === 0) {
        imgData = object.data;
      } else {
        imgData = this._toDataUrl(object.data,'image/png');
        // jscs:disable requireCapitalizedConstructors
      }
      if (!w || !h) {
        //measure image
        var m = this._measureImage(imgData);
        w = m.width;
        h = m.height;
      }
      //traslate from pixeles to milimeters
      w = (w / this._quality) * 25.4;
      h = (h / this._quality) * 25.4;
      var position = this._getXYPosition(object,w,h);
      pdf.addImage(imgData,'png',position.x,position.y,w,h);
    };
  this._renderText = function(pdf, object) {
    if (object.size && typeof(object.size) === 'number') {
      pdf.setFontSize(object.size);
    }
    var position = this._getXYPosition(object,0,0);
    pdf.text(object.data,position.x,position.y);
  };
  this._renderContent = function(pdf) {
    if (this._options && this._options.content) {
      for (var i = 0; i < this._options.content.length; i++) {
        this._renderObject(pdf,this._options.content[i]);
      }
    }
  };

  this._getXYPosition = function(object, width, height) {
    var x;
    var y;
    var margins = this._getMargins();
    if (object.vAlign) {
      y = object.vAlign === gsc.ReportConst.VerticalAlign.Top ?
      margins.top :
      this._dimensions[1] - margins.bottom - height;
    } else {
      y = margins.top;
    }
    switch (object.hAlign){
      case gsc.ReportConst.HorizontalAlign.Right:
        x = this._dimensions[0] - margins.right - width;
      break;
      case gsc.ReportConst.HorizontalAlign.Center:
        x = (this._dimensions[0] / 2) - (width / 2);
      break;
      case gsc.ReportConst.HorizontalAlign.Left:
        x = margins.left;
      break;
      default:
        x = margins.left;
      break;
    }
    return {
      'x': x,
      'y': y
    };
  };

  this._toDataUrl = function(url, outputFormat) {
    var request = new window.XMLHttpRequest();
    request.open('GET', url, false);
    request.overrideMimeType('text/plain; charset=x-user-defined');
    request.send(null);
    var data = null;
    if (request.status === 200) {
      // jscs:disable maximumLineLength
      data = 'data:' + outputFormat + ';base64,' + _base64Encode(request.response);
      // jscs:enable maximumLineLength
    }
    return data;
  };

  // jscs:disable 
  var _base64Encode = function(str) {
    var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var out = '', i = 0, len = str.length, c1, c2, c3;
    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
        out += CHARS.charAt(c1 >> 2);
        out += CHARS.charAt((c1 & 0x3) << 4);
        out += '==';
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
        out += CHARS.charAt(c1 >> 2);
        out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += CHARS.charAt((c2 & 0xF) << 2);
        out += '=';
        break;
      }
      c3 = str.charCodeAt(i++);
      out += CHARS.charAt(c1 >> 2);
      out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      out += CHARS.charAt(c3 & 0x3F);
    }
    return out;
  };
  // jscs:enable
  this._measureImage = function(data) {
    var img = document.createElement('img');
    img.src = data;
    return {
      width: img.width,
      height: img.height
    };
  };
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
            // jscs:enable maximumLineLength
            report._renderContent(pdf,dim);
            //report._addImage(pdf,data,dim,ratio);
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
        // jscs:enable maximumLineLength
        report._renderContent(pdf,dim);
        //report._addImage(pdf,data,dim,ratio);
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
