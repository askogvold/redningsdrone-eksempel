(function () {
    'use strict';

    var map = L.map('map').setView([61.937012, 10.480614], 10);

    var i, layer;
    var layers = L.tileLayer.kartverket.getLayers();

    var baseLayers = {};
    for (i = 0; i < layers.length; i++) {
        layer = layers[i];
        baseLayers[layer] = L.tileLayer.kartverket(layer);
    }
    baseLayers[layers[0]].addTo(map);
    L.control.layers(baseLayers).addTo(map);

    var droneMarker = L.marker([61.937012, 10.480614]).addTo(map);

    droneMarker.bindPopup("<b>Drone!</b><br>lat: x.<br>lon: x.<br>hdg: x<br>spd: x");

    var circle = L.circle([61.937012, 10.480614 + 0.1], 500, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
    }).addTo(map);

    circle.bindPopup("<b>Signal</b><br>IMSI: 12782391723659137");


    var wsUrl;
    if (window.location.protocol === "https:") {
        wsUrl = "wss:";
    } else {
        wsUrl = "ws:";
    }
    wsUrl += "//" + window.location.host;

    var ws = new WebSocket(wsUrl);
    ws.onmessage = function (event) {
        var data = JSON.parse(event.data);
        droneMarker.setLatLng(data.drone.pos);
        circle.setLatLng(data.signals[0].pos);
        circle.setRadius(data.signals[0].radius);
    };

}());