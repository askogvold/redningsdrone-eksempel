var redningsdrone = (function () {
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

    var wsUrl;
    if (window.location.protocol === "https:") {
        wsUrl = "wss:";
    } else {
        wsUrl = "ws:";
    }
    wsUrl += "//" + window.location.host;

    var redCircle = {
        color: 'red',
        fill: false,
        weight: 1,
        opacity: 1
    };

    var ws = new WebSocket(wsUrl);
    ws.onmessage = function (event) {
        var data = JSON.parse(event.data);
        droneMarker.setLatLng(data.drone.pos);
        var c = L.circle(data.drone.pos, data.signals[0].radius, redCircle).addTo(map);
    };

    addCircles(map);


    function addCircles(map) {
        var savnet = [62.78435, 9.521566667];
        var p1 = [62.6462, 9.775233333];
        var p2 = [62.71481667, 9.773466667];
        var p3 = [62.77845, 9.7641];
        var p4 = [62.91065, 9.7515];

        var d1 = 20100;
        var d2 = 15000;
        var d3 = 12400;
        var d4 = 18300;

        L.circle(p1, d1, redCircle).addTo(map);
        L.circle(p2, d2, redCircle).addTo(map);
        L.circle(p3, d3, redCircle).addTo(map);
        L.circle(p4, d4, redCircle).addTo(map);

        L.marker(savnet).addTo(map);
        map.setView(savnet, 10);
    }

    return {map: map};
}());