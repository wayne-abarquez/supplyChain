
var ABCChina = '<div id="ABCChinaContent">' +
			   '	<h1 class="infoWindowHeading">ABC China</h1>' +
			   '	<div class="infoWindowBody">' +
			   '		<table>'  +
			   '			<tr>' +
			   '				<td class="tdLeft"> Production Lead Time </td> <td class="tdRight">10 days</td>' +
			   '			</tr>' +
			   '			<tr>' +
			   '				<td class="tdLeft"> Logistics Lead Time </td> <td class="tdRight">16 days</td>' +
			   '			</tr>' +
			   '			<tr>' +
			   '				<td class="tdLeft"> Capacity </td> <td class="tdRight">50%</td>' +
			   '			</tr>' +
			   '		</ul>' +
			   '	</div>' +
			   '</div>';
var ABCChinaInfowindow = new google.maps.InfoWindow({content: ABCChina, zIndex:1});

var NOSMexica = '<div id="NOSMexicaContent">' +
			   '	<h1 class="infoWindowHeading">NOS Mexica</h1>' +
			   '	<div class="infoWindowBody">' +
			   '		<table>'  +
			   '			<tr>' +
			   '				<td class="tdLeft"> Production Lead Time </td> <td class="tdRight">4 days</td>' +
			   '			</tr>' +
			   '			<tr>' +
			   '				<td class="tdLeft"> Capacity </td> <td class="tdRight">80%</td>' +
			   '			</tr>' +
			   '		</ul>' +
			   '	</div>' +
			   '</div>';
var NOSMexicaInfowindow = new google.maps.InfoWindow({content: NOSMexica, zIndex:1});

var TESLA = '<div id="TESLAContent">' +
			   '	<h1 class="infoWindowHeading">TESLA</h1>' +
			   '	<div class="infoWindowBody">' +
			   '		<table>'  +
			   '			<tr>' +
			   '				<td class="tdLeft"> Production Lead Time </td> <td class="tdRight">2 days</td>' +
			   '			</tr>' +
			   '			<tr>' +
			   '				<td class="tdLeft"> Capacity </td> <td class="tdRight">90%</td>' +
			   '			</tr>' +
			   '		</ul>' +
			   '	</div>' +
			   '</div>';
var TESLAInfowindow = new google.maps.InfoWindow({content: TESLA, zIndex:1});

var XYZAustrilia = '<div id="XYZAustriliaContent">' +
			   '	<h1 class="infoWindowHeading">XYZ Austrilia</h1>' +
			   '	<div class="infoWindowBody">' +
			   '		<table>'  +
			   '			<tr>' +
			   '				<td class="tdLeft"> Production Lead Time </td> <td class="tdRight">6 days</td>' +
			   '			</tr>' +
			   '			<tr>' +
			   '				<td class="tdLeft"> Capacity </td> <td class="tdRight">70%</td>' +
			   '			</tr>' +
			   '		</ul>' +
			   '	</div>' +
			   '</div>';
var XYZAustriliaInfowindow = new google.maps.InfoWindow({content: XYZAustrilia, zIndex:1});

var AKAMI = '<div id="AKAMIContent">' +
			   '	<h1 class="infoWindowHeading">AKA MI</h1>' +
			   '	<div class="infoWindowBody">' +
			   '		<table>'  +
			   '			<tr>' +
			   '				<td class="tdLeft"> Production Lead Time </td> <td class="tdRight">8 days</td>' +
			   '			</tr>' +
			   '			<tr>' +
			   '				<td class="tdLeft"> Capacity </td> <td class="tdRight">60%</td>' +
			   '			</tr>' +
			   '		</ul>' +
			   '	</div>' +
			   '</div>';
var AKAMIInfowindow = new google.maps.InfoWindow({content: AKAMI, zIndex:1});

var WOWAZ = '<div id="WOWAZContent">' +
			   '	<h1 class="infoWindowHeading">WOW AZ</h1>' +
			   '	<div class="infoWindowBody">' +
			   '		<table>'  +
			   '			<tr>' +
			   '				<td class="tdLeft"> Production Lead Time </td> <td class="tdRight">4 days</td>' +
			   '			</tr>' +
			   '			<tr>' +
			   '				<td class="tdLeft"> Capacity </td> <td class="tdRight">45%</td>' +
			   '			</tr>' +
			   '		</ul>' +
			   '	</div>' +
			   '</div>';
var WOWAZInfowindow = new google.maps.InfoWindow({content: WOWAZ, zIndex:1});

var CNCGermany = '<div id="CNCGermanyContent">' +
			   '	<h1 class="infoWindowHeading">CNC Germany</h1>' +
			   '	<div class="infoWindowBody">' +
			   '		<table>'  +
			   '			<tr>' +
			   '				<td class="tdLeft"> Production Lead Time </td> <td class="tdRight">10 days</td>' +
			   '			</tr>' +
			   '			<tr>' +
			   '				<td class="tdLeft"> Capacity </td> <td class="tdRight">80%</td>' +
			   '			</tr>' +
			   '		</ul>' +
			   '	</div>' +
			   '</div>';
var CNCGermanyInfowindow = new google.maps.InfoWindow({content: CNCGermany, zIndex:1});

var FXCRussia = '<div id="FXCRussiaContent">' +
			   '	<h1 class="infoWindowHeading">FXC Russia</h1>' +
			   '	<div class="infoWindowBody">' +
			   '		<table>'  +
			   '			<tr>' +
			   '				<td class="tdLeft"> Production Lead Time </td> <td class="tdRight">14 days</td>' +
			   '			</tr>' +
			   '			<tr>' +
			   '				<td class="tdLeft"> Capacity </td> <td class="tdRight">38%</td>' +
			   '			</tr>' +
			   '		</ul>' +
			   '	</div>' +
			   '</div>';
var FXCRussiaInfowindow = new google.maps.InfoWindow({content: FXCRussia, zIndex:1});

var TECKorea = '<div id="TECKoreaContent">' +
			   '	<h1 class="infoWindowHeading">TEC Korea</h1>' +
			   '	<div class="infoWindowBody">' +
			   '		<table>'  +
			   '			<tr>' +
			   '				<td class="tdLeft"> Production Lead Time </td> <td class="tdRight">16 days</td>' +
			   '			</tr>' +
			   '			<tr>' +
			   '				<td class="tdLeft"> Capacity </td> <td class="tdRight">55%</td>' +
			   '			</tr>' +
			   '		</ul>' +
			   '	</div>' +
			   '</div>';
var TECKoreaInfowindow = new google.maps.InfoWindow({content: TECKorea, zIndex:1});

var infoWindows = [TECKoreaInfowindow, FXCRussiaInfowindow, CNCGermanyInfowindow,
                   WOWAZInfowindow, AKAMIInfowindow, XYZAustriliaInfowindow,
                   TESLAInfowindow, NOSMexicaInfowindow, ABCChinaInfowindow];

function initializeInfoWindows()
{
	for(var infoWindow in infoWindows)
	{
		infoWindows[infoWindow].setZIndex(1);
	}
}

initializeInfoWindows();