//<![CDATA[

/**
 * Based on code provided by Mike Williams
 * http://econym.org.uk/gmap/arrows.htm
 * Improved and transformed to v3
 */

var map, setArrows;
var polylines = {};
var markers = {};
//            var road_path1 = new google.maps.MVCArray(), direction_service1 = new google.maps.DirectionsService(), road_poly1;
var direction_service = new google.maps.DirectionsService();
var lineSymbol = {
    path: 'M 0, -1 0, 1',
    strokeOpacity: 1,
    scale: 2
};

function ArrowHandler() {
    this.setMap(map);
    // Markers with 'head' arrows must be stored
    this.arrowheads = [];
}
// Extends OverlayView from the Maps API
ArrowHandler.prototype = new google.maps.OverlayView();

// Draw is inter alia called on zoom change events.
// So we can use the draw method as zoom change listener
ArrowHandler.prototype.draw = function () {

    if (this.arrowheads.length > 0) {
        for (var i = 0, m; m = this.arrowheads[i]; i++) {
            m.setOptions({position: this.usePixelOffset(m.p1, m.p2)});
        }
    }
};


// Computes the length of a polyline in pixels
// to adjust the position of the 'head' arrow
ArrowHandler.prototype.usePixelOffset = function (p1, p2) {

    var proj = this.getProjection();
    var g = google.maps;
    var dist = 12; // Half size of triangle icon

    var pix1 = proj.fromLatLngToContainerPixel(p1);
    var pix2 = proj.fromLatLngToContainerPixel(p2);
    var vector = new g.Point(pix2.x - pix1.x, pix2.y - pix1.y);
    var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    var normal = new g.Point(vector.x / length, vector.y / length);
    var offset = new g.Point(pix2.x - dist * normal.x, pix2.y - dist * normal.y);

    return proj.fromContainerPixelToLatLng(offset);
};


// Returns the triangle icon object
ArrowHandler.prototype.addIcon = function (file) {
    var g = google.maps;
    var icon = {
        url: "http://www.google.com/mapfiles/" + file,
        size: new g.Size(24, 24), anchor: new g.Point(12, 12)
    };
    return icon;
};

// Creates markers with corresponding triangle icons
ArrowHandler.prototype.create = function (p1, p2, center_pos, mode, partNumber) {
    var markerpos;
    var g = google.maps;
    if (mode == "onset") markerpos = p1;
    else if (mode == "head") markerpos = this.usePixelOffset(p1, p2);
    else if (mode == "midline") markerpos = center_pos; //g.geometry.spherical.interpolate(p1, p2, 0.5);

    // Compute the bearing of the line in degrees
    var dir = g.geometry.spherical.computeHeading(p1, p2).toFixed(1);
    // round it to a multiple of 3 and correct unusable numbers
    dir = Math.round(dir / 3) * 3;
    if (dir < 0) dir += 240;
    if (dir > 117) dir -= 120;

    //temporary: need to come up an algorithm for this
    if (dir == 45) // || dir == 27
        dir = 81;

    if (dir == 84)
        dir = 117;

    // use the corresponding icon
    var icon = this.addIcon("dir_" + dir + ".png");
    var marker = new g.Marker({
        position: markerpos,
        map: map, icon: icon, clickable: true
    });

//                var marker = new g.Marker({
//                    position: markerpos,
//                    map: map,
////                    icon: icon,
//                    clickable: true
//                });
//                var heading = g.geometry.spherical.computeHeading(p1, p2);
//                marker.setIcon({
//                    path: g.SymbolPath.FORWARD_CLOSED_ARROW,
//                    scale: 6,
//                    rotation: heading
//                });

    // logic to concatenate source - destination
    var destination = partNumber.Stamping_Supplier;
    if (partNumber.Location == destination)
        destination = 'TESLA';

    var routeDiv = '<div>' +
        '	<h1 class="infoWindowHeading">' + partNumber.Location + ' to ' + destination + '</h1>' +
        '	<div>' +
        '		<table>' +
        '			<tr>' +
        '				<td class="tdLeft"> Production Lead Time </td> <td class="tdRight">' + partNumber.Production_LT + '</td>' +
        '			</tr>' +
        '			<tr>' +
        '				<td class="tdLeft"> Logistics Lead Time </td> <td class="tdRight">' + partNumber.Logistics_LT + '</td>' +
        '			</tr>' +
        '			<tr>' +
        '				<td class="tdLeft"> Capacity </td> <td class="tdRight">' + partNumber.Capacity + '</td>' +
        '			</tr>' +
        '		</ul>' +
        '	</div>' +
        '</div>';
    var routeInfowindow = new google.maps.InfoWindow({content: routeDiv});
    google.maps.event.addListener(marker, 'click', function () {
        routeInfowindow.open(map, marker);
    });

    if (markers[partNumber.PartNumber]) {
        markers[partNumber.PartNumber].push(marker);
    } else {
        markers[partNumber.PartNumber] = [];
        markers[partNumber.PartNumber].push(marker);
    }

    if (mode == "head") {
        // Store markers with 'head' arrows to adjust their offset position on zoom change
        marker.p1 = p1;
        marker.p2 = p2;
        // marker.setValues({ p1: p1, p2: p2 });
        this.arrowheads.push(marker);
    }
};

ArrowHandler.prototype.load = function (points, mode, partNumber, stamp_point_start) {
    var filtered_partNumbers = filter(initialData, 'PartNumber', partNumber.PartNumber);
    if (filtered_partNumbers.length > 0) {
        sortNumbersAscending('Poly_Order', filtered_partNumbers);

        var arrow_count = 0;
        for (var i = 0; i < points.length - 1; i++) {
            if (filtered_partNumbers[arrow_count]) {
                var p1 = points[i], p2 = points[i + 1];
                var bounds = new google.maps.LatLngBounds();
                bounds.extend(p1);
                bounds.extend(p2);

                this.create(p1, p2, bounds.getCenter(), mode, filtered_partNumbers[arrow_count]);

                if ((i + 1) == stamp_point_start)
                    arrow_count += 1;
            }
        }
    }
};

// Draws a polyline with accordant arrow heads
function createPoly(coordinates, mode, partNumber, stamp_point_start) {
    if (coordinates && coordinates.length > 0) {
        var points = [];
        for (var i = 0, len = coordinates.length; i < len; i++) {
            if (coordinates[i].isRoad) {
                points.length = 0;
                for (var k = i, k_len = coordinates.length; k < k_len; k++) {
                    if (coordinates[k].isRoad) {
                        points.push(coordinates[k]);
                        if (k == (k_len - 1)) {
                            createRoadPoly(points, partNumber);
                            i = k;
                        }
                    } else {
                        createRoadPoly(points, partNumber);
                        i = k - 1;
                        break;
                    }
                }
            } else {
                points.length = 0;
                if (i > 0) points.push(coordinates[i - 1].LatLong);
                for (var l = i, l_len = coordinates.length; l < l_len; l++) {
                    if (!coordinates[l].isRoad) {
                        points.push(coordinates[l].LatLong);
                        if (l >= (l_len + 1)) {
                            createWaterPoly(points, mode, partNumber, stamp_point_start);
                        }
                    } else {
                        points.push(coordinates[l].LatLong);
                        createWaterPoly(points, mode, partNumber, stamp_point_start);
                        i = l - 1;
                        break;
                    }
                }
            }
        }
    }

//                var poly = new google.maps.Polyline({
//                    strokeColor: "#0000ff",
//                    //strokeOpacity: 0.8,
////                    strokeWeight: 3,
//                    strokeOpacity: 0,
//                    icons: [
//                        {
//                            icon: lineSymbol,
//                            offset: '0',
//                            repeat: '12px'
//                        }
//                    ],
//                    map: map,
//                    path: coordinates });
//
//                if (polylines[partNumber.PartNumber]) {
//                    polylines[partNumber.PartNumber].push(poly);
//                } else {
//                    polylines[partNumber.PartNumber] = [];
//                    polylines[partNumber.PartNumber].push(poly);
//                }
//
//                setArrows.load(coordinates, mode, partNumber, stamp_point_start);

//                var bounds = new google.maps.LatLngBounds();
//                for (var i = 0; i < path.length; i++) {
//                    bounds.extend(path[i]);
//                }
//
//                var myMarker = new google.maps.Marker({
//                    position: bounds.getCenter(),
//                    draggable: true
////                    icon: {
////                        path: 'M -2,0 0,-2 2,0 0,2 z',
////                        strokeColor: '#F00',
////                        fillColor: '#F00',
////                        fillOpacity: 2,
////                        strokeWeight: 8
////                    }
//                });
//
//                google.maps.event.addListener(myMarker, 'dragend', function (evt) {
////                    document.getElementById('current').innerHTML = '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>';
//                    console.log('Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3));
//                });
//
//                google.maps.event.addListener(myMarker, 'dragstart', function (evt) {
////                    document.getElementById('current').innerHTML = '<p>Currently dragging marker...</p>';
//                });
//
//                map.setCenter(myMarker.position);
//                myMarker.setMap(map);

//                return poly;
}

function createRoadPoly(points, partNumber) {
    if (points != null && points.length > 1) {
        var filtered_partNumbers = filter(initialData, 'PartNumber', partNumber.PartNumber);
        if (filtered_partNumbers.length > 0) {
            sortNumbersAscending('Poly_Order', filtered_partNumbers);

            for (var m = 1, m_len = points.length; m < m_len; m++) {
                var curr_obj_for_poly = {
                    'm': m,
                    'isNextOtherCompany': points[m - 1].isNextCompany
                };
                (function (curr_obj_for_poly) {
                    var road_path = new google.maps.MVCArray();
                    var road_poly = new google.maps.Polyline({
                        strokeColor: "#17A4DB",
                        strokeOpacity: 6,
                        strokeWeight: 8,
                        map: map
                    });
                    road_path.push(points[curr_obj_for_poly.m - 1].LatLong);
                    if (road_path.getLength() === 1) {
                        road_poly.setPath(road_path);
                    }

                    direction_service.route({
                        origin: road_path.getAt(road_path.getLength() - 1),
                        destination: points[curr_obj_for_poly.m].LatLong,
                        travelMode: google.maps.DirectionsTravelMode.DRIVING
                    }, function (result, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                                road_path.push(result.routes[0].overview_path[i]);
                            }

                            var mid_point = null;
                            var road_path_len_divisible = road_path.length;
                            if ((road_path_len_divisible % 2) == 1) road_path_len_divisible -= 1;
                            mid_point = road_path.j[road_path_len_divisible / 2];
                            if (mid_point) {
                                // Add icon
                                // logic to concatenate source - destination
                                var specific_partNumber = null
                                if (curr_obj_for_poly.isNextOtherCompany) specific_partNumber = filtered_partNumbers[1]; //hard coded as of the moment
                                else specific_partNumber = filtered_partNumbers[0];

                                if (specific_partNumber) {
                                    var destination = specific_partNumber.Stamping_Supplier;
                                    if (specific_partNumber.Location == destination)
                                        destination = 'TESLA';

                                    var road_routeDiv = '<div>' +
                                        '	<h1 class="infoWindowHeading">' + specific_partNumber.Location + ' to ' + destination + '</h1>' +
                                        '	<div>' +
                                        '		<table>' +
                                        '			<tr>' +
                                        '				<td class="tdLeft"> Production Lead Time </td> <td class="tdRight">' + specific_partNumber.Production_LT + '</td>' +
                                        '			</tr>' +
                                        '			<tr>' +
                                        '				<td class="tdLeft"> Logistics Lead Time </td> <td class="tdRight">' + specific_partNumber.Logistics_LT + '</td>' +
                                        '			</tr>' +
                                        '			<tr>' +
                                        '				<td class="tdLeft"> Capacity </td> <td class="tdRight">' + specific_partNumber.Capacity + '</td>' +
                                        '			</tr>' +
                                        '		</ul>' +
                                        '	</div>' +
                                        '</div>';
                                    var road_marker = new google.maps.Marker({
                                        position: mid_point,
                                        map: map, icon: "images/truck.png"
                                    });
                                    var routeInfowindow = new google.maps.InfoWindow({content: road_routeDiv});
                                    google.maps.event.addListener(road_marker, 'click', function () {
                                        routeInfowindow.open(map, road_marker);
                                    });

                                    if (markers[partNumber.PartNumber]) {
                                        markers[partNumber.PartNumber].push(road_marker);
                                    } else {
                                        markers[partNumber.PartNumber] = [];
                                        markers[partNumber.PartNumber].push(road_marker);
                                    }
                                }
                            }
                        }
                    });

                    if (polylines[partNumber.PartNumber]) {
                        polylines[partNumber.PartNumber].push(road_poly);
                    } else {
                        polylines[partNumber.PartNumber] = [];
                        polylines[partNumber.PartNumber].push(road_poly);
                    }
                })(curr_obj_for_poly);
            }
        }
    }
}

function createWaterPoly(points, mode, partNumber, stamp_point_start) {
    if (points != null && points.length > 1) {
        var water_poly = new google.maps.Polyline({
            strokeColor: "#0000ff",
            strokeOpacity: 0,
            icons: [
                {
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '12px'
                }
            ],
            map: map,
            path: points
        });

        if (polylines[partNumber.PartNumber]) {
            polylines[partNumber.PartNumber].push(water_poly);
        } else {
            polylines[partNumber.PartNumber] = [];
            polylines[partNumber.PartNumber].push(water_poly);
        }

        setArrows.load(points, mode, partNumber, stamp_point_start);
    }
}

function createTeslaInfoWindow(data) {
    var content = '<div>';
    content += '<h1 class="infoWindowHeading">' + data.title + '</h1>';
    content += '<div class="infoWindowBody">';
    content += '<table><tr>';
    content += '<td class="tdLeft"> Production Lead Time </td> <td class="tdRight">' + data.content.production_lead_time + ' days</td></tr>';
    content += '<tr><td class="tdLeft"> Capacity </td> <td class="tdRight">' + data.content.capacity + '</td></tr>';
    content += '</ul></div></div>';

    return content;
}

var teslaMarkers = [];

function loadTeslaMarkers () {
    teslaMarkersData.forEach(function(data){

        var marker = new google.maps.Marker({
            position: data.position,
            map: map,
            title: data.title,
            icon: data.icon
        });

        // InfoWindow
        marker.infowindow = new google.maps.InfoWindow({content: createTeslaInfoWindow(data), zIndex: 1});

        // Marker Listener
        google.maps.event.addListener(marker, 'click', function () {
            marker.infowindow.open(map, marker);
            marker.infowindow.setZIndex(2);
        });
    });
}

function initialize() {
    var mapOptions = {
        center: {
            lat: 31.151092,
            lng: -179.813041
        },
        zoom: 3
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    loadTeslaMarkers();

    //var ABCChinaLatLng = new google.maps.LatLng(39.630867, 118.180194);
    //var ABCChinaMarker = new google.maps.Marker({
    //    position: ABCChinaLatLng,
    //    map: map,
    //    title: "ABC China",
    //    icon: "images/c-marker.png"
    //});
    //
    //google.maps.event.addListener(ABCChinaMarker, 'click', function () {
    //    ABCChinaInfowindow.open(map, ABCChinaMarker);
    //    initializeInfoWindows();
    //    ABCChinaInfowindow.setZIndex(2);
    //});
    //
    //var NOSMexicaLatLng = new google.maps.LatLng(21.161908, -86.851528);
    //var NOSMexicaMarker = new google.maps.Marker({
    //    position: NOSMexicaLatLng,
    //    map: map,
    //    title: "NOS Mexica",
    //    icon: "images/s-marker.png"
    //});
    //
    //google.maps.event.addListener(NOSMexicaMarker, 'click', function () {
    //    NOSMexicaInfowindow.open(map, NOSMexicaMarker);
    //    initializeInfoWindows();
    //    NOSMexicaInfowindow.setZIndex(2);
    //});
    //
    //var TESLALatLng = new google.maps.LatLng(37.492667, -121.944091);
    //var TESLAMarker = new google.maps.Marker({
    //    position: TESLALatLng,
    //    map: map,
    //    title: "TESLA",
    //    icon: "images/tesla-marker.png"
    //});
    //
    //google.maps.event.addListener(TESLAMarker, 'click', function () {
    //    TESLAInfowindow.open(map, TESLAMarker);
    //    initializeInfoWindows();
    //    TESLAInfowindow.setZIndex(2);
    //});
    //
    //var XYZAustriliaLatLng = new google.maps.LatLng(-20.597908, 117.171393);
    //var XYZAustriliaMarker = new google.maps.Marker({
    //    position: XYZAustriliaLatLng,
    //    map: map,
    //    title: "XYZ Austrilia",
    //    icon: "images/c-marker.png"
    //});
    //
    //google.maps.event.addListener(XYZAustriliaMarker, 'click', function () {
    //    XYZAustriliaInfowindow.open(map, XYZAustriliaMarker);
    //    initializeInfoWindows();
    //    XYZAustriliaInfowindow.setZIndex(2);
    //});
    //
    //var AKAMILatLng = new google.maps.LatLng(42.96336, -85.668086);
    //var AKAMIMarker = new google.maps.Marker({
    //    position: AKAMILatLng,
    //    map: map,
    //    title: "AKA MI",
    //    icon: "images/c-marker.png"
    //});
    //
    //google.maps.event.addListener(AKAMIMarker, 'click', function () {
    //    AKAMIInfowindow.open(map, AKAMIMarker);
    //    initializeInfoWindows();
    //    AKAMIInfowindow.setZIndex(2);
    //});
    //
    //var WOWAZLatLng = new google.maps.LatLng(33.448377, -112.074037);
    //var WOWAZMarker = new google.maps.Marker({
    //    position: WOWAZLatLng,
    //    map: map,
    //    title: "WOW AZ",
    //    icon: "images/s-marker.png"
    //});
    //
    //google.maps.event.addListener(WOWAZMarker, 'click', function () {
    //    WOWAZInfowindow.open(map, WOWAZMarker);
    //    initializeInfoWindows();
    //    WOWAZInfowindow.setZIndex(2);
    //});
    //
    //var CNCGermanyLatLng = new google.maps.LatLng(52.42265, 10.786546);
    //var CNCGermanyMarker = new google.maps.Marker({
    //    position: CNCGermanyLatLng,
    //    map: map,
    //    title: "CNC Germany",
    //    icon: "images/c-marker.png"
    //});
    //
    //google.maps.event.addListener(CNCGermanyMarker, 'click', function () {
    //    CNCGermanyInfowindow.open(map, CNCGermanyMarker);
    //    initializeInfoWindows();
    //    CNCGermanyInfowindow.setZIndex(2);
    //});
    //
    //var FXCRussiaLatLng = new google.maps.LatLng(55.755826, 37.6173);
    //var FXCRussiaMarker = new google.maps.Marker({
    //    position: FXCRussiaLatLng,
    //    map: map,
    //    title: "FXC Russia",
    //    icon: "images/c-marker.png"
    //});
    //
    //google.maps.event.addListener(FXCRussiaMarker, 'click', function () {
    //    FXCRussiaInfowindow.open(map, FXCRussiaMarker);
    //    initializeInfoWindows();
    //    FXCRussiaInfowindow.setZIndex(2);
    //});
    //
    //var TECKoreaLatLng = new google.maps.LatLng(37.566535, 126.977969);
    //var TECKoreaMarker = new google.maps.Marker({
    //    position: TECKoreaLatLng,
    //    map: map,
    //    title: "TEC Korea",
    //    icon: "images/c-marker.png"
    //});
    //
    //google.maps.event.addListener(TECKoreaMarker, 'click', function () {
    //    TECKoreaInfowindow.open(map, TECKoreaMarker);
    //    initializeInfoWindows();
    //    TECKoreaInfowindow.setZIndex(2);
    //});

    setArrows = new ArrowHandler();

//                road_poly1 = new google.maps.Polyline({
//                    strokeColor: "#17A4DB",
//                    strokeOpacity: 6,
//                    strokeWeight: 8,
//                    map: map
//                });
//
//                google.maps.event.addListener(map, "click", function (evt) {
//                    // 0 length when start
//                    if (road_path1.getLength() === 0) {
//                        // push ex. latlong { A: 97, F: 98 }
//                        road_path1.push(evt.latLng);
//                        if (road_path1.getLength() === 1) {
//                            road_poly1.setPath(road_path1);
//                        }
//                        console.log('Road Start: ', evt.latLng);
//                    } else {
//                        console.log('Road End: ', evt.latLng);
//                        direction_service1.route({
//                            origin: road_path1.getAt(road_path1.getLength() - 1),
//                            destination: evt.latLng,
//                            travelMode: google.maps.DirectionsTravelMode.DRIVING
//                        }, function (result, status) {
//                            if (status == google.maps.DirectionsStatus.OK) {
//                                for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
//                                    road_path1.push(result.routes[0].overview_path[i]);
//                                }
//                            }
//                        });
//                    }
//                });
}

google.maps.event.addDomListener(window, 'load', initialize);

$(document).ready(function () {
    var tableSpeed = 300;
    var navSpeed = 800;
    $('body').on('click', '.pullupTable', function () {
        var status = $(this).attr('pullup-status');
        if (status == 'off') {
            $('.showup').show();
            $('.showdown').hide();
            $(this).attr('pullup-status', 'on');
            /*$('#table-container').stop().animate({ height: [ tableHeight + 'px','swing'] },300);*/
            $('.clients_table').stop().slideUp(tableSpeed);
        } else {
            $('.showup').hide();
            $('.showdown').show();
            $(this).attr('pullup-status', 'off');
            /*$('#table-container').stop().animate({ height: ['40px','swing'] },300); */
            $('.clients_table').stop().slideDown(tableSpeed);
        }
    });
    $('body').on('click', '.tesla-logo-pulldown', function () {
        $('.navbar-container').stop().fadeIn(navSpeed);
        $('.tesla-logo-pulldown-div').stop().fadeOut(navSpeed);
    });
    $('body').on('click', '.tesla-logo', function () {
        $('.tesla-logo-pulldown-div').stop().fadeIn(navSpeed);
        $('.navbar-container').stop().fadeOut(navSpeed);
    });

    $('body').on('click', '.toggleCharts', function () {
        var chartsStatus = $(this).attr('charts-status');

        if ('off' == chartsStatus) {
            $('.TeslaRed').show();
            $('.TeslaBlack').hide();
            $(this).attr('charts-status', 'on');
        }
        else {
            $('.TeslaRed').hide();
            $('.TeslaBlack').show();
            $(this).attr('charts-status', 'off');
        }
    });

    $('.TeslaRed').hide();
    $('.showup').hide();
    $('.clients_table').stop().slideDown(tableSpeed);
    $('.tesla-logo-pulldown-div').stop().fadeOut(navSpeed);
});