(function(){
'use strict';

(function(){
'use strict';

angular.module('teslaBase')
    .factory('gmapServices', [gmapServices]);

    function gmapServices() {
        var service = {};

        service.defaultZoom = 3;
        service.defaultLatLng = new google.maps.LatLng(31.151092, -179.813041);

        service.apiAvailable = apiAvailable;
        service.createMap = createMap;

        service.initMarker = initMarker;
        service.createMarker = createMarker;

        service.createInfoWindow = createInfoWindow;
        service.showInfoWindow = showInfoWindow;
        service.hideInfoWindow = hideInfoWindow;

        service.addListener = addListener;

        function apiAvailable() {
            return typeof window.google === 'object';
        }

        function createMap(mapId) {
            var mapIdLoc = mapId || 'map3d';
            var myMapId = '#' + mapIdLoc;

            if (service.map) return service.map;
            if (!service.apiAvailable()) return null;

            var mapOptions = {
                zoom: service.defaultZoom,
                center: service.defaultLatLng
            };

            $(myMapId).height($(window).height());

            service.map = new google.maps.Map(document.getElementById(mapIdLoc), mapOptions);

            // handle window resize event
            google.maps.event.addDomListener(window, 'resize', function () {
                $(myMapId).height($(window).height());
                var center = service.map.getCenter();
                google.maps.event.trigger(service.map, 'resize');
                service.map.setCenter(center);
            });

            return service.map;
        }

        function initMarker(_position, _icon, _opts) {
            if (!service.apiAvailable()) return null;

            var additionalOpts = _opts || {};

            var opts = angular.extend({}, {
                position: _position,
                map: service.map,
                icon: _icon
            }, additionalOpts);

            return new google.maps.Marker(opts);
        }

        function createMarker(_position, _icon, _opts) {
            var opts = _opts || {},
                icon = _icon || 'images/c-marker.png';

            return service.initMarker(_position, icon, opts);
        }

        function createInfoWindow(content) {
            if (!service.apiAvailable()) return null;
            return new google.maps.InfoWindow({content: content});
        }


        function showInfoWindow(infoWindow, target) {
            if (infoWindow) infoWindow.open(service.map, target);
        }

        function hideInfoWindow(infoWindow) {
            if (infoWindow) infoWindow.close();
        }

        function addListener(instance, eventName, handler) {
            if (!service.apiAvailable()) return null;
            return google.maps.event.addListener(instance, eventName, handler);
        }


        return service;
    }
}());

}());