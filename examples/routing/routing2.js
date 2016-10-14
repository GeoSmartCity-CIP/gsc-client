var styles = {
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

var styleFunction = function (feature) {
	return styles[feature.getGeometry().getType()];
};


var pointSource = new ol.source.Vector({ wrapX: false });



var pointLayer = new ol.layer.Vector({
	source: pointSource

});
var map = new ol.Map({
	layers: [
		new ol.layer.Tile({
		    source: new ol.source.OSM()
		  }), pointLayer
	],
	target: 'map',
	controls: ol.control.defaults({
		attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
			collapsible: false
		})
	}),
	view: new ol.View({
		center: [313376, 5156227],
		zoom: 12
	})
});
var vectorLayer;
var arr = [];
map.on('click', function (e) {
	var point = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');

	if (arr.length == 1) {
		arr.push(point);
		document.getElementById("x1").value = arr[0][0];
		document.getElementById("y1").value = arr[0][1];
		document.getElementById("x2").value = arr[1][0];
		document.getElementById("y2").value = arr[1][1];
		
		var RoutingUrl = 'http://hub.geosmartcity.eu/GironaRouting/geo/RestService/getroute??';
		//var RoutingUrl = 'geo/RestService/getroute?';
		//RoutingUrl = 'http://localhost:8080/GironaRouting/geo/RestService/getroute?';
        
		RoutingUrl += ('x1=' + arr[0][0] + '&y1=' + arr[0][1] + '&x2=' + arr[1][0] + '&y2=' + arr[1][1]);
		console.log(RoutingUrl);

		vectorLayer = new ol.layer.Vector({
			source: new ol.source.Vector({
				url: RoutingUrl,
				format: new ol.format.GeoJSON()
			}),
			style: styleFunction
		});
		map.addLayer(vectorLayer);
		}

	if (arr.length == 0) {
		arr.push(point);
		var x = point[0];
		var y = point[1];
		document.getElementById("x1").value = x;
		document.getElementById("y1").value = y;
	}
});


var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:3857',
    // comment the following two lines to have the mouse position
    // be placed within the map.
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position'),
    undefinedHTML: '&nbsp;'
  });


function myFunction() {
	document.getElementById("x1").value = null;
	document.getElementById("y1").value = null;
	document.getElementById("x2").value = null;
	document.getElementById("y2").value = null;
	arr = [];
	map.removeLayer(vectorLayer);
}
