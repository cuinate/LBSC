var places = function(){
 
	  var defaultLatLng;
	  var defaultZoom = 13;
	  var geocoder;
	  var infoWindow;
	  var map;
	  var marker;
	  var markers;
	  var maxZoom = 15;
	  
	//var centerLatitude = 39.989059;  
	//var centerLongitude = 116.351811;
	
	  var centerMapOnAddress = function() {
	    geocodeAddress($.trim($('#address').val()));
	  }

	  var centerMapOnPosition = function(latLng) {
	    map.setCenter(latLng);
	    map.setZoom(maxZoom);
	    marker.setMap(map);
	    marker.setPosition(latLng);
	    setPosition(latLng);
	  }

	  var centerMapOnSplitAddress = function() {
	    var address = $('#place_street_address').val() + ' ' + 
	      $('#place_city').val() + ' ' + 
	      $('#place_state').val() + ' ' + 
	      $('#place_postal_code').val();

	    geocodeAddress(address);
	  }

	  var flag = function(place_id, reason, marker) {
	    $.post('/places/' + place_id + '/flag_as_' + reason + '.json',
	      { _method: 'put' },
	      function() {
	        infoWindow.close();
	        marker.setMap(null);
	        $('#flag_place_dialog').dialog('close');
	      });
	  }

	  var geocodeAddress = function(address) {
	    // Skip Google geocoding if address is a coordinate pair
	    if (coordinates = address.match(/^(\-?\d+\.\d+) *[, ] *(\-?\d+\.\d+)$/)) {
	      var latLng = new google.maps.LatLng(coordinates[1], coordinates[2]);
	      centerMapOnPosition(latLng);
	    } else {
	      geocoder.geocode({ 'address': address }, function(results, status) {
	        if (status == google.maps.GeocoderStatus.OK) {
	          centerMapOnPosition(results[0].geometry.location);
	        } else {
	          resetMap();
	        }
	      });
	    }
	  }

	  var getPosition = function() {
	    return new google.maps.LatLng($('#place_lat').val(), $('#place_lng').val());
	  }

	  var initializeAdmin = function() {
	    initializeDefaults();
	    initializeMap('map_canvas');
	    centerMapOnAddress();

	    $('#center_map').click(function() {
	      centerMapOnAddress();
	    });
	  }

	  var initializeDefaults = function() {

	    defaultLatLng = new google.maps.LatLng(39.989059, 116.351811);
	    geocoder = new google.maps.Geocoder();
	    infoWindow = new google.maps.InfoWindow();
	    marker = new google.maps.Marker({ draggable: true });
	    markers = [];

	    google.maps.event.addListener(marker, 'dragend', function() {
	      setPosition(marker.getPosition());
	    });

	    $(document).ajaxError(function(e, xhr, settings, exception) {
	      if (xhr.status == 400) {
	        alert($.parseJSON(xhr.responseText).error);
	      } else {
	        alert('ZOMG! An error ocurred, please try again.');
	      }
	    });
	  }

	  var initializeDialogs = function(place_name_selector, place_id_selector) {
	    initializeDefaults();

	    $('#select_place_dialog').dialog({
	      autoOpen: false,
	      beforeclose: function(event, ui) {
	        infoWindow.close();
	      },
	      modal: true,
	      open: function(event, ui) {
	        $('#search_places_name').val('');
	        $('#search_places_address').val('');
	        $('.s_result').hide().filter(':first').show();
	        initializeMap('search-map');
	      },
	      width: 720,
	      resizable: false
	    });

	    $('.select_place').click(function() {
	      $('#select_place_dialog').dialog('open');
	    });

	    $('#search_places').submit(function() {
	      search(place_name_selector, place_id_selector);
	    });

	    $('#save_place_dialog').dialog({
	      autoOpen: false,
	      buttons: {
	        Submit: function() {
		/*
	          $(this).find('form').submit(function() {
	            $.post(this.action + '.json',
	              $(this).serialize(), 
	              function(data) { 
	                $(place_name_selector).val(data.place.name);
	                $(place_id_selector).val(data.place.id);
	                $('#save_place_dialog').dialog('close');
	              }, 
	              'json'
	            );
	   

	            return false;
	          });
      */

	          $(this).find('form').submit();
	        },
	        'Go Back': function() {
	          $('#select_place_dialog').dialog('open');
	          $(this).dialog('close');
	        }
	      },
	      modal: true,
	      open: function(event, ui) {
	        initializeMap('save_map');
	        marker.setMap(map);
	        marker.setPosition(getPosition());
	        $('#select_place_dialog').dialog('close');
	      },
	      width: 720
	    });

	    $('.add_place_open').click(function() {
	      $('#save_place_dialog').load('/places/new.js', function() {
	        $('#save_place_dialog').dialog('open');
	      });
	    });

	    $('#flag_place_dialog').dialog({
	      autoOpen: false,
	      modal: true,
	      width: 470
	    });

	    $('#center_map').live('click', function() {
	      centerMapOnSplitAddress();
	    });
	  }

	  var initializeMap = function(id) {
	    map = new google.maps.Map(document.getElementById(id), {
	      center: defaultLatLng,
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      zoom: defaultZoom
	    });
	  }

	  var initializeShow = function(lat, lng, placeName) {
	    var latLng = new google.maps.LatLng(lat, lng);

	    var map = new google.maps.Map(document.getElementById('map_canvas'), {
	      center: latLng,
	      disableDefaultUI: true,
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      scrollwheel: false,
	      zoom: maxZoom
	    });

	    var marker = new google.maps.Marker({
	      map: map,
	      position: latLng,
	      title: placeName
	    });
	  }

	  var resetMap = function() {
	    map.setCenter(defaultLatLng);
	    map.setZoom(defaultZoom);
	    marker.setMap(null);
	    setLatLng(null, null);

	    $.each(markers, function(i, marker) {
	      marker.setMap(null);
	    });

	    markers = [];
	  }

var search = function(place_name_selector, place_id_selector) {
	    $('.s_result').hide().filter('.searching').show();
	    var address = $('#search_places_address').val();

	    geocoder.geocode({ 'address': address }, function(results, status) {
	      if (status == google.maps.GeocoderStatus.OK) {
		/*--------- merge the show place with search ----*/
		//1.show the success info
	      $('.s_result strong span').html(results.length);
	      $('.s_result').hide().filter('.success').show();
	   // 2. map center and reset the map
	      resetMap();
	      map.setCenter(results[0].geometry.location);
	     //  var latLngBounds = new google.maps.LatLngBounds();
	      // var latLng = new google.maps.LatLng(result[0].geometry.location.lat, result[0].geometry.location.lng);
	   // 3. go through each result to insert into marker and infowindow
	      $.each(results, function(i, data) {
		     
		   	//3.1 set marker	
			    var Geocoder_result = data;
			   
		        var marker = new google.maps.Marker({
		            map: map, 
		            position: Geocoder_result.geometry.location
		        });
		        markers.push(marker);
		    //3.2 set content of info_window   
		        var content = $('<div/>', {
			            'class': 'loc_content'
			          })
			       .append($('<h2/>', {
			        text: Geocoder_result.formatted_address
			      }))
			      .append($('<span/>', {
			            text: Geocoder_result.street_address
			          }))
			       .append($('<a/>', {
			            href: 'javascript:void(0);',
			            click: function() {
			          //    alert('you choosed :' + Geocoder_result.formatted_address );
			              save_place_to_form(Geocoder_result);
						  $('#save_place_dialog').dialog('open');
			              infoWindow.close();
			            },
			            text: 'save'
			          }))
			     .append($('<a/>', {
			        href: 'javascript:void(0);',
			        click: function() 
			         {infoWindow.close();
				     },
			        text: 'cancel'
			      }));
			// 3.3 connect marker and infowindow via marker callback function
		     	 google.maps.event.addListener(marker, 'click', function() {
					  infoWindow.setContent(content.get(0));
			          infoWindow.open(map, marker);
			        });
		   //latLngBounds.extend(latLng);
	      });

	      google.maps.event.addListenerOnce(map, 'zoom_changed', function() {
	        if (map.getZoom() > maxZoom) {
	          map.setZoom(maxZoom);
	        }
	      });

	    // map.fitBounds(latLngBounds);
		
		 /*--------- merge the show place with search ----*/	
	      } 
	  else {
	    /* --- merge showplace function here ----*/
		    $('.s_result').hide().filter('.error').show();
	        //showPlaces([]);
	      }
	    });
	  }

	  var setLatLng = function(lat, lng) {
	    $('#place_lat').val(lat);
	    $('#place_lng').val(lng);
	  }

	  var setPosition = function(position) {
	    setLatLng(position.lat(), position.lng());
	  }

var save_place_to_form = function(Geocoder_result){
	var formvalue = Geocoder_result;
	var place_name;
	var place_address;
	var place_city;
	var place_state;
	var place_lat;
	var place_lng;

    //get the postal code if result returns
    for (i=0; i<formvalue.address_components.length; i++)
	{
		for (j=0;j<formvalue.address_components[i].types.length;j++)
		{
			if(formvalue.address_components[i].types[j] == "sublocality")
			place_name = formvalue.address_components[i].long_name;
			if(formvalue.address_components[i].types[j] == "administrative_area_level_1")
			place_state = formvalue.address_components[i].long_name;
			if(formvalue.address_components[i].types[j] == "locality")
			place_city = formvalue.address_components[i].long_name;
			
		}
	}
	place_lat = formvalue.geometry.location.lat();
	place_lng = formvalue.geometry.location.lng();
	// set the input valude
	$('#place_name').attr("value",place_name);
	$('#place_street_address').attr("value",formvalue.formatted_address);
	$('#place_city').attr("value",place_city);
	$('#place_state').attr("value",place_state);	
//	$('#place_postal_code').val(formvalue.formatted_address);
	$('#place_lat').attr("value",place_lat);
	$('#place_lng').attr("value",place_lng);
	// set the challenge place name 
	$("#search_places_name").attr("value",place_name);
	
	
	
}

	  return {
	    initializeAdmin: initializeAdmin,
	    initializeDialogs: initializeDialogs,
	    initializeShow: initializeShow
	  };
	}();
