'use strict';

var gsc = gsc || {};

gsc.routing = gsc.routing || {};

var RoutingUrl = "http://hub.geosmartcity.eu/GironaRouting/";
RoutingUrl = "http://localhost:8080/GironaRouting/";

/**
 * Get a list of coordinates for a name
 *
 * @param {String[]} geonames An array of one or more geonames
 */
gsc.routing.routing = function (x1, y1, x2, y2) {
    $.ajax({
        url: RoutingUrl,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            var layer1 = new ol.layer.Vector({
                source: new ol.source.Vector({
                    url: data,
                    format: new ol.format.GeoJSON({
                        defaultDataProjection: 'EPSG:4326',
                        projection: 'EPSG:3857'
                    })
                }),
                name: 'Route'
            });
            return layer1;
        },
        error: function (e) {
            console.log('error: ' + e.result);
        }

    });


