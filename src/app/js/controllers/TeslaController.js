function deleteProperties(objectToClean)
{
	for (var x in objectToClean)
	{
		if (objectToClean.hasOwnProperty(x))
		{
			for (var i = 0, len = objectToClean[x].length; i < len; i++)
			{
				objectToClean[x][i].setMap(null);
			}
			
			delete objectToClean[x];
		}
	}		
}
//usage: deleteProperties(objectToClean);

function filterByKey(client)
{
	var key = this.key;
	var searchString = this.searchString;
	var result = client[key].indexOf(searchString);
	
	//var testVar = 'debug var';
	
	if(result >= 0)
		return true;
	
	return false;
}

function filter(clients, key, searchString)
{
	var testSubject = {'key' : key,
					   'searchString' : searchString
					  };
	var processedClients = clients.filter(filterByKey, testSubject);
	
	return processedClients;
}

function sortAscending(index, processedClients)
{
  var results = [];

  if(index == 'Production_LT' || index == 'PartNumber' || index == 'Material')
  {
	results = sortNumbersAscending(index, processedClients);
  }
  else if(index == 'Gauge' || index == 'Volume')
  {
	results = sortFloatAscending(index, processedClients);
  }
  else
  {
	results = sortStringAscending(index, processedClients);  
  }
  
  return results;
}

function sortDescending(index, processedClients)
{
  var results = [];

  if(index == 'Production_LT')
  {
	results = sortNumbersDescending(index, processedClients);
  }
  else if(index == 'Gauge' || index == 'Volume')
  {
	results = sortFloatDescending(index, processedClients);
  }
  else
  {
	results = sortStringDescending(index, processedClients);    
  }
  
  return results
}

function numPages(clients, recordsPerPage)
{
    return Math.ceil(clients.length / recordsPerPage);
}

function sortStringDescending(index, processedClients)
{
  processedClients.sort(function(subjectA, subjectB)
  {
	  (String(subjectA[index]) < String(subjectB[index])) ? returnVal = 1 : returnVal = 0;
	  return returnVal;
  });
  
  return processedClients;
}

function sortStringAscending(index, processedClients)
{
	processedClients.sort(function(subjectA, subjectB)
    {
	  (String(subjectA[index]) < String(subjectB[index])) ? returnVal = -1 : returnVal = 1;
	  return returnVal;
    });
   
   return processedClients;
}

function sortNumbersDescending(index, processedClients)
{
	processedClients.sort(function(subjectA, subjectB)
	{
		return parseInt(subjectB[index]) - parseInt(subjectA[index]);
	});
	
  return processedClients;
}

function sortNumbersAscending(index, processedClients)
{
	processedClients.sort(function(subjectA, subjectB)
	{
		return parseInt(subjectA[index]) - parseInt(subjectB[index]);
	});
	
  return processedClients;
}

function sortFloatDescending(index, processedClients)
{
	processedClients.sort(function(subjectA, subjectB)
	{
		return parseFloat(subjectB[index]) - parseFloat(subjectA[index]);
	});
	
  return processedClients;
}

function sortFloatAscending(index, processedClients)
{
	processedClients.sort(function(subjectA, subjectB)
	{
		return parseFloat(subjectA[index]) - parseFloat(subjectB[index]);
	});
	
  return processedClients;
}

function filterByKey_Number(partNumber)
{
    return partNumber[this.key] == this.searchNumber;
}

function filter_PartNumber_Origin(partNumbers, key1, searchString, key2, searchNumber)
{
    var search_params = {'key' : key1,
        'searchString' : searchString
    };
    var filtered_by_PartNumber = partNumbers.filter(filterByKey, search_params);
    if (filtered_by_PartNumber.length > 0) {
        var search_num_params = {'key' : key2,
            'searchNumber' : searchNumber
        };
        filtered_by_PartNumber = filtered_by_PartNumber.filter(filterByKey_Number, search_num_params);
    }

    return filtered_by_PartNumber;
}

(function () {
	'use strict';
	angular.module('teslaBase')
	.controller('teslaBaseController', ['$scope', '$http', function($scope, $http)
	{
		$scope.companys = companyData;
		$scope.clients = simplifiedData;
		$scope.processedClients = [];
		$scope.search_clients = {'PartNumber' : '',
							   'Material' : '',
							   'Gauge' : '',
							   'Volume' : '',
							   'MODEL' : '',
							   'Coil_Supplier' : '',
							   'Stamping_Supplier' : '',
							   'Production_LT' : '',
							   'Logistics_LT' : '',
							   'Capacity' : ''
							  };
		$scope.panel_display = {'client_table' : true};
		$scope.clients_table_body_display = true;
		$scope.clients_order_by_field = '';
		$scope.clients_reverse_sort = false;
		$scope.clients_current_page = 1;
		$scope.clients_per_page = 5;
		$scope.max_clients = $scope.clients.length;
		$scope.max_pages = numPages($scope.clients, $scope.clients_per_page);
		$scope.disablePrev = false;
		$scope.disableNext = false;
		$scope.reinitialzePagingVariables = false;
		$scope.filteredClients = [];
		$scope.useFilteredClients = false;
		$scope.doNotReinitializeCurrentPage = false;
		$scope.highlighted_rows = [];
		$scope.activateRefresherOrb = true;
		$scope.filterPressing = false;

		$scope.chartsFlag = false;
		$scope.showChartsModal = false;


		$scope.RefresherOrb = function()
		{
			///// reseting the charts toggle ////
			$scope.chartsFlag = false;
			$scope.chartsModalListener();
			$scope.removeBlueClass();
			$('.TeslaRed').hide();
    		$('.TeslaBlack').show();
    		$("#chartsToggle").attr('charts-status','off');
			///// reseting the charts toggle ////
			
			$scope.filterPressing = false;
			
			deleteProperties(polylines);
			deleteProperties(markers);
			
			$scope.companys = companyData;
			$scope.clients = simplifiedData;
			$scope.processedClients = [];
			$scope.search_clients = {'PartNumber' : '',
								   'Material' : '',
								   'Gauge' : '',
								   'Volume' : '',
								   'MODEL' : '',
								   'Coil_Supplier' : '',
								   'Stamping_Supplier' : '',
								   'Production_LT' : '',
								   'Logistics_LT' : '',
								   'Capacity' : ''
								  };
			$scope.panel_display = {'client_table' : true};
			$scope.clients_table_body_display = true;
			$scope.clients_order_by_field = '';
			$scope.clients_reverse_sort = false;
			$scope.clients_current_page = 1;
			$scope.clients_per_page = 5;
			$scope.max_clients = $scope.clients.length;
			$scope.max_pages = numPages($scope.clients, $scope.clients_per_page);
			$scope.disablePrev = true;
			$scope.disableNext = false;
			$scope.reinitialzePagingVariables = false;
			$scope.filteredClients = [];
			$scope.filteredClients = $scope.clients;
			$scope.useFilteredClients = false;
			$scope.doNotReinitializeCurrentPage = false;
			$scope.highlighted_rows = [];

			for(var counter = 0; counter < $scope.clients_per_page; counter++ )
			{
				$scope.processedClients.push($scope.clients[counter]);
			}
		}

		$scope._begin_update_clients_listing = function()
		{
			$scope._update_clients_listing();
			var debugVar = 'debugVariable does nothing at all';
		};

		$scope._update_clients_listing = function()
		{
			var params = $scope._build_clients_url_params();
		  	$scope.fetch_clients(params);
		};

		$scope._build_clients_url_params = function()
		{
		  	var params = {'empty' : true};
		  	
		  	if(false == $scope.activateRefresherOrb)
		  	{
		  		params['empty'] = false;
		  	}
		  	
			var debugVar = 'debugVariable does nothing at all';

			/////////////////////////////////////
			// SORT ASCENDING DESCENDING LOGIC //
			if ($scope.clients_order_by_field)
			{
				var params = {};
				params['sortBy'] = $scope.clients_order_by_field;

				if($scope.clients_reverse_sort)
				{
					params['orderBy'] = "desc";
				}
				else
				{
					params['orderBy'] = "asc";
				}
			}
			// SORT ASCENDING DESCENDING LOGIC //
			/////////////////////////////////////

			/////////////////////////////////////
			// 		 FILTER LOGIC 			   //
			if($scope.search_clients.PartNumber)
			  	params['PartNumberSearchString'] = $scope.search_clients.PartNumber;
			if($scope.search_clients.Material)
			  	params['MaterialSearchString'] = $scope.search_clients.Material;
			if($scope.search_clients.Gauge)
			 	params['GaugeSearchString'] = $scope.search_clients.Gauge;
			if($scope.search_clients.Volume)
				params['VolumeSearchString'] = $scope.search_clients.Volume;
			if($scope.search_clients.MODEL)
			 	params['MODELSearchString'] = $scope.search_clients.MODEL;
			if($scope.search_clients.Coil_Supplier)
			 	params['Coil_SupplierSearchString'] = $scope.search_clients.Coil_Supplier;
			if($scope.search_clients.Stamping_Supplier)
				params['Stamping_SupplierSearchString'] = $scope.search_clients.Stamping_Supplier;
			if($scope.search_clients.Production_LT)
			 	params['Production_LTSearchString'] = $scope.search_clients.Production_LT;
			if($scope.search_clients.Logistics_LT)
			 	params['Logistics_LTSearchString'] = $scope.search_clients.Logistics_LT;
			if($scope.search_clients.Capacity)
			 	params['CapacitySearchString'] = $scope.search_clients.Capacity;
			// 		 FILTER LOGIC 			   //
			/////////////////////////////////////

		  	return params;
		};

		$scope.search_clients_update = function()
		{
			var params = {'empty' 						  : false,
					  'PartNumberSearchString' 		  : $scope.search_clients.PartNumber,
					  'MaterialSearchString' 		  : $scope.search_clients.Material,
					  'GaugeSearchString'	 		  : $scope.search_clients.Gauge,
					  'VolumeSearchString'	 		  : $scope.search_clients.Volume,
					  'MODELSearchString'			  : $scope.search_clients.MODEL,
					  'Coil_SupplierSearchString' 	  : $scope.search_clients.Coil_Supplier,
					  'Stamping_SupplierSearchString' : $scope.search_clients.Stamping_Supplier,
					  'Production_LTSearchString' 	  : $scope.search_clients.Production_LT,
					  'Logistics_LTSearchString' 	  : $scope.search_clients.Logistics_LT,
					  'CapacitySearchString' 		  : $scope.search_clients.Capacity
					 };
			$scope.doNotReinitializeCurrentPage = false;
			$scope.fetch_clients(params);
		};

		$scope.fetch_clients = function(params)
		{
			// REFRESHER ORB
			if(params['empty'] == true)
			{
				$scope.clients = sortDescending('PartNumber', $scope.clients);
				$scope.processedClients = [];
				$scope.filteredClients = [];
				$scope.filteredClients = $scope.clients;

			  	for(var counter = 0; counter < $scope.clients_per_page; counter++ )
				{
					$scope.processedClients.push($scope.clients[counter]);
					//$scope.filteredClients.push($scope.clients[counter]);
				}

			  	$scope.disablePrev = true;
			}
			// REFRESHER ORB

			//////////////////////////////////////////////////////
			//  PROCESSING FOR SORT ASCENDING DESCENDING LOGIC  //
			var index = params['sortBy'];
			if('desc' == params['orderBy'])
			{
				$scope.processedClients = sortDescending(index, $scope.processedClients);
				var debugVariable = "debugging here";
			}
			if('asc' == params['orderBy'])
			{
				$scope.processedClients = sortAscending(index, $scope.processedClients);
				var debugVariable = "debugging here";
			}
			//  PROCESSING FOR SORT ASCENDING DESCENDING LOGIC  //
			//////////////////////////////////////////////////////

			//////////////////////////////////////////////////////
			//  		  PROCESSING FOR FILTER LOGIC			  //
			if(params['PartNumberSearchString'])
			{
				$scope.filteredClients = filter($scope.filteredClients, 'PartNumber', params['PartNumberSearchString']);
				$scope.processedClients = $scope.filteredClients;
				$scope.reinitialzePagingVariables = true;
				$scope.filterPressing = true;
			}
			if(params['MaterialSearchString'])
			{
				$scope.filteredClients = filter($scope.filteredClients, 'Material', params['MaterialSearchString']);
				$scope.processedClients = $scope.filteredClients;
				$scope.reinitialzePagingVariables = true;
				$scope.filterPressing = true;
			}
			if(params['GaugeSearchString'])
			{
				$scope.filteredClients = filter($scope.filteredClients, 'Gauge', params['GaugeSearchString']);
				$scope.processedClients = $scope.filteredClients;
				$scope.reinitialzePagingVariables = true;
				$scope.filterPressing = true;
			}
			if(params['VolumeSearchString'])
			{
				$scope.filteredClients = filter($scope.filteredClients, 'Volume', params['VolumeSearchString']);
				$scope.processedClients = $scope.filteredClients;
				$scope.reinitialzePagingVariables = true;
				$scope.filterPressing = true;
			}
			if(params['MODELSearchString'])
			{
				$scope.filteredClients = filter($scope.filteredClients, 'MODEL', params['MODELSearchString']);
				$scope.processedClients = $scope.filteredClients;
				$scope.reinitialzePagingVariables = true;
				$scope.filterPressing = true;
			}
			if(params['Coil_SupplierSearchString'])
			{
				$scope.filteredClients = filter($scope.filteredClients, 'Coil_Supplier', params['Coil_SupplierSearchString']);
				$scope.processedClients = $scope.filteredClients;
				$scope.reinitialzePagingVariables = true;
				$scope.filterPressing = true;
			}
			if(params['Stamping_SupplierSearchString'])
			{
				$scope.filteredClients = filter($scope.filteredClients, 'Stamping_Supplier', params['Stamping_SupplierSearchString']);
				$scope.processedClients = $scope.filteredClients;
				$scope.reinitialzePagingVariables = true;
				$scope.filterPressing = true;
			}
			if(params['Production_LTSearchString'])
			{
				$scope.filteredClients = filter($scope.filteredClients, 'Production_LT', params['Production_LTSearchString']);
				$scope.processedClients = $scope.filteredClients;
				$scope.reinitialzePagingVariables = true;
				$scope.filterPressing = true;
			}
			if(params['Logistics_LTSearchString'])
			{
				$scope.filteredClients = filter($scope.filteredClients, 'Logistics_LT', params['Logistics_LTSearchString']);
				$scope.processedClients = $scope.filteredClients;
				$scope.reinitialzePagingVariables = true;
				$scope.filterPressing = true;
			}
			if(params['CapacitySearchString'])
			{
				$scope.filteredClients = filter($scope.filteredClients, 'Capacity', params['CapacitySearchString']);
				$scope.processedClients = $scope.filteredClients;
				$scope.reinitialzePagingVariables = true;
				$scope.filterPressing = true;
			}

			////////////////////////////////////////
			///// Reinitialize Paging Variables
			if(true == $scope.reinitialzePagingVariables)
			{
				if(false == $scope.doNotReinitializeCurrentPage)
				{
					$scope.clients_current_page = 1;
				}

				$scope.clients_per_page 	= 5;
				$scope.max_clients			= $scope.processedClients.length;
				$scope.max_pages 			= numPages($scope.processedClients, $scope.clients_per_page);
				$scope.disablePrev 			= false;
				$scope.disableNext 			= false;
				$scope.filteredClients		= $scope.processedClients;
				$scope.useFilteredClients   = true;

				if($scope.clients_current_page == 1)
				{
				  $scope.disablePrev = true;
				  $scope.clients_current_page = 1;
				}
				else
				  $scope.disablePrev = false;

				if($scope.clients_current_page == $scope.max_pages)
				{
				  $scope.disableNext = true;
				}
				else
				  $scope.disableNext = false;


				if(0 == $scope.max_pages)
				{
					$scope.disableNext = true;
					$scope.clients_current_page = 0;
				}
			}

			$scope.reinitialzePagingVariables = false;
			///// Reinitialize Paging Variables
			////////////////////////////////////////


			var refresherOrbActivate = 0; // if it reaches 10, activate refresher orb
			for(var searchClientKey in $scope.search_clients)
			{
				var searchClientObject =  $scope.search_clients[searchClientKey];
				
				if('' == searchClientObject)
					refresherOrbActivate++
			}
			
			if(10 == refresherOrbActivate && true == $scope.filterPressing)
				$scope.RefresherOrb();

			//  		  PROCESSING FOR FILTER LOGIC			  //
			//////////////////////////////////////////////////////

			//////////////////////////////////////////////////////
			//  		  PROCESSING FOR PAGINATION LOGIC		  //
			if(true == $scope.activate_paging )
			{
				if($scope.clients_current_page == 1)
				{
				$scope.disablePrev = true;
				$scope.clients_current_page = 1;
				}
				else
				$scope.disablePrev = false;

				if($scope.clients_current_page == $scope.max_pages)
				{
				$scope.disableNext = true;
				}
				else
				$scope.disableNext = false;

				$scope.processedClients = [];
				var startingEntry = ($scope.clients_per_page * $scope.clients_current_page) - 5;
				var endingEntry	= startingEntry + ($scope.clients_per_page); // no need to subtract 1 because the "end" of slice() is ommitted by default

				if(true == $scope.useFilteredClients)
				{
				//		= $scope.processedClients;
				$scope.processedClients = $scope.filteredClients.slice( startingEntry, endingEntry);
				}
				else
				{
					$scope.processedClients = $scope.clients.slice( startingEntry, endingEntry);
				}

				$scope.activate_paging = false;
			}
			//  		  PROCESSING FOR PAGINATION LOGIC		  //
			//////////////////////////////////////////////////////
		};

		$scope.Clients_NextPage = function ()
		{
			$scope.clients_current_page += 1;
			$scope.activate_paging = true;
			$scope.activateRefresherOrb = false;
			$scope.doNotReinitializeCurrentPage = true;
			$scope._begin_update_clients_listing (  );
		};

		$scope.Clients_PrevPage = function ()
		{
			$scope.clients_current_page -= 1;
			$scope.activate_paging = true;
			$scope.activateRefresherOrb = false;
			$scope.doNotReinitializeCurrentPage = true;
			$scope._begin_update_clients_listing (  );
		};

		$scope.chartsFlagListener = function() // listener if the Charts Glyphicon has been toggled
		{
			if(false == $scope.chartsFlag) // Charts Glyphicon currently black
			{
				$scope.chartsFlag = true;
			}
			else						   // Charts Glyphicon currently red
			{
				$scope.chartsFlag = false;
				$scope.chartsModalListener();
				$scope.removeBlueClass();
			}
		}
		
		$scope.chartsModalListener = function() // listener if the charts modal is shown or not
		{
			if(true == $scope.showChartsModal)
				$scope.showChartsModal = false;
		}

		$scope.removeBlueClass = function()
		{
    		for(var index in $scope.highlighted_rows)
    		{
    			var debug = 'debugging here';

    			if( $scope.highlighted_rows[index].indexOf("blue") > -1 )
    			{
    				var debug = 'debugging here';
    				$scope.highlighted_rows[index] = $scope.highlighted_rows[index].replace(" blue", "");
    				$scope.highlighted_rows[index] = $scope.highlighted_rows[index].replace("blue", "");
    			}
    		}
		}
		
        $scope.report_PartNumberSelected_EventHandler = function (partNumber)
        {
        								  ////////////////////////////////////////////////////////////////
        	if(true == $scope.chartsFlag) //////   meaning, show charts mode
        	{
        		$scope.removeBlueClass();

        		if('' == $scope.highlighted_rows[partNumber.PartNumber] || 
        		  typeof $scope.highlighted_rows[partNumber.PartNumber] == 'undefined')
        		{
        			$scope.highlighted_rows[partNumber.PartNumber] = 'blue';
        		}
        		else
        			$scope.highlighted_rows[partNumber.PartNumber] += ' blue';
        		

        		var debug = 'debugging here';

        		var completePartsDetails = $scope.filteredClients = filter(initialData, 'PartNumber', partNumber.PartNumber);
				var barGraphCategories = [];
				var barGraphSeries = [{name: 'Production Lead Time',
									   data: []
									  },
									  {name: 'Logistics Lead Time',
									   data: []
									  }
									 ];
				var pieGraphSeriesData = [];
				var pieChartsColor = [];
				
            	// loop through the completePartsDetails and display its chart
            	for(var counter = 0; counter < completePartsDetails.length; counter++)
            	{
            		var part = completePartsDetails[counter];
					
					if(part.Location == part.Stamping_Supplier)
					{
						barGraphCategories.push(part.Location + '-' + 'NAVAGIS');
					}
					else
					{
						barGraphCategories.push(part.Coil_Supplier + '-' + part.Stamping_Supplier);
					}

					barGraphSeries[0].data[counter] = part.Production_LT;
					barGraphSeries[1].data[counter] = parseInt(part.Logistics_LT);
					
					var capacity = part.Capacity;
					capacity = capacity.replace('%','')
					pieGraphSeriesData.push({name: part.Location,
											 y: parseInt(capacity)
											}
										   );
					
					if(parseInt(capacity) >= 80) // RED
					{
						pieChartsColor.push("#E60000");
					}
					if(parseInt(capacity) >= 60 && parseInt(capacity) < 80) // YELLOW
					{
						pieChartsColor.push("#A99C0F");
					}
					if(parseInt(capacity) > 0 && parseInt(capacity) < 60) // GREEN
					{
						pieChartsColor.push("#004E0E");
					}
					
					// #E60000 RED 
					// #A99C0F YELLOW
					// #004E0E GREEN
					
					if(1 == completePartsDetails.length)
					{
						pieGraphSeriesData.push({name: 'Unused Capacity',
												 y: 100 - parseInt(capacity)
												}
											   );
						pieChartsColor.push("#444447");
					}
            	}

        		$scope.create_chart(barGraphCategories, barGraphSeries, pieGraphSeriesData, pieChartsColor);

        		var debugVar = 'debugVariable does nothing at all';
        		$scope.showChartsModal = true;
        	}	 						  //////   meaning, show charts mode
        								  ////////////////////////////////////////////////////////////////
        								  ////////////////////////////////////////////////////////////////
        	else 						  //////   meaning, show routes mode
        	{
                if ($scope.highlighted_rows[partNumber.PartNumber]=='error') {
    				$scope.highlighted_rows[partNumber.PartNumber] = '';
                    if (polylines[partNumber.PartNumber] && polylines[partNumber.PartNumber].length > 0) {
                        for (var i = 0, len = polylines[partNumber.PartNumber].length; i < len; i++) {
                            polylines[partNumber.PartNumber][i].setMap(null);
                        }
                        polylines[partNumber.PartNumber].length = 0;
                    }
                    if (markers[partNumber.PartNumber] && markers[partNumber.PartNumber].length > 0) {
                        for (var i = 0, len = markers[partNumber.PartNumber].length; i < len; i++) {
                            markers[partNumber.PartNumber][i].setMap(null);
                        }
                        markers[partNumber.PartNumber].length = 0;
                    }
                } else {
    				$scope.highlighted_rows[partNumber.PartNumber] = 'error';
                    var points = [
    					{
    						'LatLong' : new google.maps.LatLng($scope.companys[partNumber.Coil_Supplier].lat, $scope.companys[partNumber.Coil_Supplier].lng),
    						'isRoad' : $scope.companys[partNumber.Coil_Supplier].isRoad,
    						'isNextCompany': false
    					}
                    ];
    				// Get All the coordinates from coil
    				var filtered_partNumber_order1 = filter_PartNumber_Origin(initialData, 'PartNumber', partNumber.PartNumber, 'Poly_Order', 1);
    				if (filtered_partNumber_order1.length > 0) {
    					if (filtered_partNumber_order1[0].Coordinates.length > 0) {
    						for (var i = 0, len = filtered_partNumber_order1[0].Coordinates.length; i < len; i++) {
    							points.push(
    								{
    									'LatLong' : new google.maps.LatLng(filtered_partNumber_order1[0].Coordinates[i].lat, filtered_partNumber_order1[0].Coordinates[i].lng),
    									'isRoad' : filtered_partNumber_order1[0].Coordinates[i].isRoad,
    									'isNextCompany': false
    								}
    							);
    						}
    					}
    				}

    				// Add stamping coordinate
                    var stamp_point_start = points.length;
    				//points.push(new google.maps.LatLng($scope.companys[partNumber.Stamping_Supplier].lat, $scope.companys[partNumber.Stamping_Supplier].lng));
    				points.push(
    					{
    						'LatLong' : new google.maps.LatLng($scope.companys[partNumber.Stamping_Supplier].lat, $scope.companys[partNumber.Stamping_Supplier].lng),
    						'isRoad' : $scope.companys[partNumber.Stamping_Supplier].isRoad,
    						'isNextCompany': true
    					}
    				);

    				// Get All the coordinates from stamping
    				var filtered_partNumber_order2 = filter_PartNumber_Origin(initialData, 'PartNumber', partNumber.PartNumber, 'Poly_Order', 2);
    				if (filtered_partNumber_order2.length > 0) {
    					if (filtered_partNumber_order2[0].Coordinates.length > 0) {
    						for (var i = 0, len = filtered_partNumber_order2[0].Coordinates.length; i < len; i++) {
    							points.push(
    								{
    									'LatLong' : new google.maps.LatLng(filtered_partNumber_order2[0].Coordinates[i].lat, filtered_partNumber_order2[0].Coordinates[i].lng),
    									'isRoad' : filtered_partNumber_order2[0].Coordinates[i].isRoad,
    									'isNextCompany': false
    								}
    							);
    						}
    					}
    				}

                    if (partNumber.Stamping_Supplier != 'NAVAGIS') {
    					points.push(
    						{
    							'LatLong' : new google.maps.LatLng($scope.companys['NAVAGIS'].lat, $scope.companys['NAVAGIS'].lng),
    							'isRoad' : $scope.companys['NAVAGIS'].isRoad,
    							'isNextCompany': true
    						}
    					);
                    }
                    createPoly(points, "midline", partNumber, stamp_point_start);
                }
                 							//////          meaning, show routes mode
        	}	 							////////////////////////////////////////////////////////////////




        };
        
        $scope.create_chart = function(barGraphCategories, barGraphSeries, pieGraphSeriesData, pieChartsColor) 
        {
        	$('#barGraphContainer').highcharts({chart: {type: 'column'},
        										credits: {enabled: false},
        										exporting: {enabled: false},
									            title: {text: 'Production and Logistics Lead Time'},
										        xAxis: {categories: barGraphCategories,
										            	crosshair: true
										        	   },
										        yAxis: {min: 0,
										            	title: {text: 'Units (pcs)'}
										        	   },
										        tooltip: {headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
										            	  pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
										                			   '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
										            	  footerFormat: '</table>',
										            	  shared: true,
										            	  useHTML: true
										        		  },
										        plotOptions: {column: {pointPadding: 0.2,
										                			   borderWidth: 0
										            				  }
										        			 },
										        series: barGraphSeries
			    });


        		$('#pieGraphContainer').highcharts({chart: {plotBackgroundColor: null,
													        plotBorderWidth: null,
													        plotShadow: false,
													        type: 'pie'
													       },
													colors: pieChartsColor,
	        										credits: {enabled: false},
	        										exporting: {enabled: false},
													title: {text: 'Capacity'},
													tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'},
													plotOptions: {pie: {allowPointSelect: true,
													                    cursor: 'pointer',
													                    dataLabels: {enabled: false},
													                    showInLegend: true
													                   }
																 },
													series: [{name: "Capacity",
													          colorByPoint: true,
													          data: pieGraphSeriesData
													         }
															]
        											});
        };

		$scope.init_highlight_rows = function() {
			for (var i = 0, len = $scope.clients.length; i < len; i++) {
				$scope.highlighted_rows.push($scope.clients[i].PartNumber);
			}
		};

		$scope._begin_update_clients_listing();
		$scope.init_highlight_rows();
	}]);
}());