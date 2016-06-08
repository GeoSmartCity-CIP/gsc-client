var options = {
    epsg: "EPSG:25830",
    bounds: [398289.3421, 4606703.4945, 828369.3421, 4830703.4945],
    units: 'm'
};

// map initializing
gsc.map.create('map',options);

// reggio_emilia layer
// layers: http://hub.geosmartcity.eu/geoserver/web/
var navarre_cadaster = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: '//idena.navarra.es/ogc/wms',
        params: {'FORMAT': 'image/png',
            'VERSION': '1.3.0',
            LAYERS: 'IDENA:catastro',
            STYLES: ''
        }
    })
});

gsc.map.addLayer(navarre_cadaster);

// add info on feature functionality
gsc.map.addInfoOnFeatureEvent('nodelist', 50, navarre_cadaster).then(function(capas){
	debugger;
});