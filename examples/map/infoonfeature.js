var options = {
    epsg: "EPSG:3003",
    bounds: [1618102.37, 4942652.95, 1640661.9, 4959185],
    units: 'm'
};

// map initializing
var gscMap = gsc.map.Map('map',options);

// reggio_emilia layer
// layers: http://hub.geosmartcity.eu/geoserver/web/
var reggio_emilia = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://hub.geosmartcity.eu/geoserver/reggio_emilia/wms',
        params: {'FORMAT': 'image/png',
            'VERSION': '1.1.1',
            LAYERS: 'reggio_emilia:edifici',
            STYLES: ''
        }
    })
});

gscMap.addLayer(reggio_emilia);

// add info on feature functionality
gscMap.addInfoOnFeatureEvent('nodelist',50,reggio_emilia);