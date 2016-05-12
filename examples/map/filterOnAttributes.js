var options = {
    epsg: "EPSG:3003",
    bounds: [1618102.37, 4942652.95, 1640661.9, 4959185],
    units: 'm'
};

// map initializing
gsc.map.create('map',options);

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

gsc.map.addLayer(reggio_emilia);

$('#updateFilterButton').on('click',function(){
    gsc.map.filterOnAttributes($('#filterType').val(),$('#filter').val())
});

$('#resetFilterButton').on('click',function(){
    gsc.map.resetFilter('cql','')
});