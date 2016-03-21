(function(){
'use strict';

angular.module('teslaBase')
    .factory('teslaMapService', ['gmapServices', 'TESLA_MARKERS', teslaMapService]);

    function teslaMapService (gmapServices, TESLA_MARKERS) {
        var service = {};

        service.initialize = initialize;

        function initialize () {
            gmapServices.createMap('map-canvas');

            TESLA_MARKERS.forEach(function(data) {
               var marker = gmapServices.createMarker(data.position, data.icon, {title: data.title});

               marker.infowindow = gmapServices.createInfoWindow(createTeslaInfoWindow(data));

               gmapServices.addListener(marker, 'click', function(){
                    gmapServices.showInfoWindow(marker.infowindow, marker);
               });
            });
        }

        function createTeslaInfoWindow(data){
            var content = '<div>';
            content += '<h1 class="infoWindowHeading">'+data.title+'</h1>';
            content += '<div class="infoWindowBody">';
            content += '<table><tr>';
            content += '<td class="tdLeft"> Production Lead Time </td> <td class="tdRight">'+data.content.production_lead_time+' days</td></tr>';
            content += '<tr><td class="tdLeft"> Capacity </td> <td class="tdRight">'+ data.content.capacity+'</td></tr>';
            content += '</ul></div></div>';

            return content;
        }

        return service;
    }
}());