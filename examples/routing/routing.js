var options = {
    epsg: "EPSG:3857",
    bounds: [305346, 5163232, 321598, 5152970],
    units: 'm'
};


var styles = {
	'LineString': new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'green',
			width: 10
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


// map initializing
gsc.map.create('map',options);

// reggio_emilia layer
// layers: http://hub.geosmartcity.eu/geoserver/web/
var osmSource = new ol.source.OSM();
var osmLayer = new ol.layer.Tile({source: osmSource});

gsc.map.addLayer(osmLayer);


var vectorLayer;
var arr = [];
gsc.map.olMap.on('click', function (e) {
	var point = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');

	if (arr.length == 1) {
		arr.push(point);
		document.getElementById("x1").value = arr[0][0];
		document.getElementById("y1").value = arr[0][1];
		document.getElementById("x2").value = arr[1][0];
		document.getElementById("y2").value = arr[1][1];


        var vectorLayer  = gsc.routing.routing(arr[0][0], arr[0][1], arr[1][0], arr[1][1]);
        vectorLayer.style = styleFunction;
		gsc.map.addLayer(vectorLayer);
		}

	if (arr.length == 0) {
		arr.push(point);
		var x = point[0];
		var y = point[1];
		document.getElementById("x1").value = x;
		document.getElementById("y1").value = y;
	}
});



function myFunction() {
	document.getElementById("x1").value = null;
	document.getElementById("y1").value = null;
	document.getElementById("x2").value = null;
	document.getElementById("y2").value = null;
	arr = [];
	gsc.map.removeLayer(vectorLayer);
}


gsc.map.addMousePositionControl('coordinate');

gsc.map.addScaleBarControl('scalebar');