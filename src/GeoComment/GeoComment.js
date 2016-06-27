'use strict';

var gsc = gsc || {};

gsc.GeoComment = gsc.GeoComment || {};

/**
 * <p>Comment geofeature object
 </p>
 * @class gsc.Geocomment
 * @constructor
 * @param {DomObject|Selector} [button] Button
 */

gsc.GeoComment = function(opts) {
  //map, container,maxFeaturesNumber,layer) {
  var _map = null;
  var _singleclickEvent = null;
  var _container = null;
  var _maxFeaturesNumber =
	(!opts.maxFeaturesNumber) ? 50 : opts.maxFeaturesNumber;
  var _layer = null;
  var _url = null;
  if (opts.map && opts.map === gsc.map) {
    _map = opts.map;
  } else {
    console.error('map parameter not defined or wrong type');
    return;
  }
  _container = !opts.container ? document.body : opts.container;
  //render button
  var _button = document.createElement('button');
  _button.setAttribute('type', 'button');
  _button.className = 'btn btn-primary';
  _button.setAttribute('data-toggle', 'button');
  _button.setAttribute('aria-pressed', 'false');
  _button.setAttribute('autocomplete', 'off');
  var buttonText = document.createTextNode('Make geocomment');
  _button.appendChild(buttonText);
  if (typeof(_container) === 'string') {
    document.querySelector(_container).appendChild(_button);
  } else if (_container instanceof window.HTMLElement) {
    document.querySelector(_container).appendChild(_button);
  } else {
    $(_container).appendChild(_button);
  }
  if (!opts.layer) {
    console.error('layer parameter not defined');
    return;
  }else {
    _layer = opts.layer;
  }
  if (!opts.url) {
    console.error('url parameter not defined');
    return;
  }else {
    _url = opts.url;
  }

  _button.onclick = function() {
    if (this.className.indexOf('active') < 0) {
      //active click map event listener
      var opts = {
        maxFeaturesNumber: _maxFeaturesNumber,
        layer: _layer
      };
      _singleclickEvent = _map.olMap.on('singleclick', _clickOnMapHandler,opts);
    } else {
      //deactive click map event listener
      _map.olMap.unByKey(_singleclickEvent);
    }
  };

  var _clickOnMapHandler = function(evt) {
    var view = _map.olMap.getView();
    var viewResolution = view.getResolution();
    var source = this.layer.getSource();
    var url = source.getGetFeatureInfoUrl(
    evt.coordinate, viewResolution, view.getProjection(),
    {'INFO_FORMAT': 'application/json',
    'FEATURE_COUNT': this.maxFeaturesNumber
    });
    var req = new window.XMLHttpRequest();
    req.onload  = function(data) {
      if (this.status == 200) {
        var format = new ol.format.GeoJSON();
        var features = format.readFeatures(this.responseText, {
          featureProjection: _map.olMap.getView().getProjection()
        });
        if (features.length > 0) {
          _render(features);
        } else {
          document.body.style.cursor = '';
        }
      }
    };
    req.open('GET',url,true);
    req.setRequestHeader('X-Requested-With','XMLHttpRequest');
    req.setRequestHeader('Content-Type','text/xml');
    req.send();
    document.body.style.cursor = 'wait';
  };
  var _CLASS = 'gsc.GeoComment.modal';
  var _CLASS2 = 'gsc.GeoComment.alert';
  var _modalDialog = null;
  var _alert = null;
  /* jshint ignore:start */
  // jscs:disable 
  this._template = (function() {
  dust.register(_CLASS, body_0);
  function body_0(chk, ctx) {
    return chk.write("<div class=\"modal fade\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button><h4 class=\"modal-title\">Comment Geofeature</h4></div><div class=\"modal-body\"><form class=\"form-horizontal formGeoComment\" role=\"form\"><div class=\"form-group\"><label class=\"control-label col-sm-2\" for=\"features\">Feature</label><div class=\"col-sm-10\"><select name=\"feature\" id=\"feature\" class=\"form-control\" title=\"Choose a feature\"><option value=\"\">Choose a feature</option>").section(ctx.get("features"), ctx, {
      "block": body_1
    }, null).write("</select>  </div>      </div><div class=\"form-group\"><label class=\"control-label col-sm-2\" for=\"id=\"comment\"\">Comment</label><div class=\"col-sm-10\"><textarea class=\"form-control\" rows=\"5\" id=\"comment\" name=\"comment\" placeholder=\"Enter a comment\"/>        </div></div><div class=\"form-group\">        <div class=\"col-sm-offset-2 col-sm-10\"><button type=\"button\" class=\"btn btn-default btnSendComment\" >Send</button><button type=\"reset\" class=\"btn btn-default\">Clear</button></div></div></form></div></div></div></div>");
  }
  function body_1(chk, ctx) {
    return chk.write("<option value=\"").reference(ctx.get("id"), ctx, "h").write("\">").reference(ctx.get("id"), ctx, "h").write("</option>\n");
  }
  return body_0;
})();
  (function() {
  dust.register(_CLASS2, body_0);

  function body_0(chk, ctx) {
    return chk.write("<div class=\"alert alert-danger\" role=\"alert\"><strong>Error!</strong> Some fields are requireds.</div>");
  }
  return body_0;
})();
  // jscs:enable
  /* jshint ignore:end */
  var _render = function(features) {
    //process features to make a simpliest object for dust template
    var data = [];
    for (var i = 0; i < features.length; i++) {
      var d = {
        id: features[i].getId(),
        prop: features[i].getProperties()
      };
      delete d.prop.geometry;
      data.push(d);
    }
    /* jshint ignore:start */
    // jscs:disable 	
    dust.render(_CLASS, {"features": data}, function() {
      document.body.style.cursor = '';
      if (_modalDialog) {
        if (_modalDialog[0].remove) {
          _modalDialog[0].remove();
        } else {
          _modalDialog[0].removeNode();
        }
				
        _modalDialog = null;
      }		
      _modalDialog = $(this.out).modal({backdrop: true,show: true});		
      _modalDialog.on('shown.bs.modal', function() {
        var button = document.getElementsByClassName("btnSendComment");
        if (button && button.length > 0) {
          button[0].onclick = _send;
        }
        var form = document.getElementsByClassName("formGeoComment");
        if (form && form.length > 0) {
          form[0].onreset = _clearAlertMesage;
        }			
      });
    });
    // jscs:enable
    /* jshint ignore:end */
  };
  var _send = function() {
    _clearAlertMesage();
    var controls = document.querySelectorAll('.modal .form-control');
    //validate the form
    var errors = false;
    for (var i = 0; i < controls.length; i++) {
      if (controls[i].value === '') {
        errors = true;
        controls[i].parentElement.className += ' has-error';
      }
    }
    //show message if errors
    if (errors) {
      /* jshint ignore:start */
      // jscs:disable 	
      dust.render(_CLASS2, null, function() {
        _alert = $(this.out).alert();
        $(".modal-body", _modalDialog[0])[0].appendChild(_alert[0]);
      });
      return;
      // jscs:enable
      /* jshint ignore:end */
    }
    //build the params object adding automatics values like the timestamp
    var params = [];
    for (var j = 0; j < controls.length; j++) {
      var control = controls[j];
      params.push({'key': control.name,'value': control.value});
    }
    params.push({'key': 'time','value': new Date().toISOString()});
    params.push(
		{'key': 'layer',
		'value': controls[0].value
			.substring(0,controls[0].value.lastIndexOf('.'))
		});
    //make service call
    _serviceCall(params);
  };
  var _serviceCall = function(params) {
    var req = new window.XMLHttpRequest();
    req.onload  = function(data) {
      _modalDialog.modal('hide');
      _map.olMap.unByKey(_singleclickEvent);
      $(_button).button('toggle');
    };
    req.open('POST',_url,true);
    req.setRequestHeader('X-Requested-With','XMLHttpRequest');
    req.setRequestHeader('Content-Type',
    'application/x-www-form-urlencoded; charset=UTF-8');
    var formData = new window.FormData();
    for (var i = 0; i < params.length; i++) {
      formData.append(params[i].key, params[i].value);
    }
    formData.processData = false;
    formData.contentType = false;
    req.send(formData);
  };
  var _clearAlertMesage = function() {
    if (_alert) {
      if (_alert[0].remove) {
        _alert[0].remove();
      } else {
        _alert[0].removeNode();
      }
      _alert = null;
    }
    var controls = document.querySelectorAll('.modal .form-control');
    //validate the form
    var errors = false;
    for (var i = 0; i < controls.length; i++) {
      controls[i].parentElement.className =
		controls[i].parentElement.className.replace(' has-error','');
    }
  };
};
