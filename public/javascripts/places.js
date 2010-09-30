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

	/* ajax helper function to send out the ajax post */

	
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
	
	   // initialize the form ajax submit function
	   	$('#challenge_dialog').dialog({
	      autoOpen: false,
	      modal: true,
		  buttons:{
	      Cancel: function() {
 					$(this).dialog("close");
	        	      },
     	  "Answer": function() {
	        
				var chan_id = $('#challenge_id_input').val();
				var points = $("#challenge_points_tag").val();
				var answer  = $("#challenge_answer").val();
			
				var place_id = $("#hidden_place_id").val();
				var user_id = $("#hidden_user_id").val();
				$.post(
				'/UserActivity/create', 
		          {
					challenge_id : chan_id,
					user_id : user_id,
					place_id :place_id,
					challenge_answer : answer,
					points :points
				  },
				  function(data){

				   $(this).dialog("close");
				  $('#sucess_dialog').dialog("open");
				 }

		        );
				$(this).dialog("close");
				return false;
       	      }
		  },
	      width: 300,
		  height: 200,
	      resizable: false
	    });
	 
	 // check_in dialog init start-------------------------------- //
	    $('#checkin_dialog').dialog({
	      autoOpen: false,
	      modal: true,
		  open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); },
		  buttons:{
	      "checkin": function() {
					var place_id = $("#hidden_place_id").val();
					var user_id = $("#hidden_user_id").val();
					$.post(
					'/UserActivity/create', 
			          {
						checkin_type_id : "1",
						user_id : user_id,
						place_id :place_id,
						points : "3"
					  },
					  function(data){
					  
					   $(this).dialog("close");
					  $('#sucess_dialog').dialog("open");
					 }

			        );
			    $(this).dialog("close");
				return false;
	       	      }
		  },
	      width: 300,
		  height: 200,
	      resizable: false
	    });
	
	    $('#checkin_dialog_twee').dialog({
	      autoOpen: false,
	      modal: true,
		  buttons:{
	      "Say it": function() {
					var place_id		= $("#hidden_place_id").val();
					var user_id 		= $("#hidden_user_id").val();
					var challenge_tweet = $("#challenge_tweet").val();
 						$.post(
						'/UserActivity/create', 
				          {
							checkin_type_id : "2",
							user_id : user_id,
							place_id :place_id,
							points : "3",
							challenge_tweet : challenge_tweet
						  },
						  function(data){

						   $(this).dialog("close");
						  $('#sucess_dialog').dialog("open");
						 }

				        );
				     $(this).dialog("close");
					return false;
		       	      },
	        	     
     	  "Cancel": function() {
				$(this).dialog("close");
       	      }
		  },
	      width: 300,
		  height: 200,
	      resizable: false
	    });
	    $('#checkin_dialog_tag').dialog({
	      autoOpen: false,
	      modal: true,
		  buttons:{
	      "Tag it": function() {
						var place_id = $("#hidden_place_id").val();
						var user_id = $("#hidden_user_id").val();
						var tag_name = $("#place_tag").val();
						$.post(
						'/PlaceTag/create', 
				          {
							user_id : user_id,
							place_id :place_id,
							tag_name : tag_name
						  },
						  function(data){
							//save the activity 
								$.post(
									'/UserActivity/create', 
							          {
										checkin_type_id : "3",
										user_id : user_id,
										place_id :place_id,
										points : "3",
										challenge_tweet :tag_name
									  },
									  function(data){

									   $(this).dialog("close");
									  $('#sucess_dialog').dialog("open");
									 }

						        );
						 }

				        );
				    $(this).dialog("close");
					return false;
		       	  },
     	  "Cancel": function() {
				$(this).dialog("close");
       	      }
		  },
	      width: 300,
		  height: 200,
	      resizable: false
	    });
    // check_in dialog init end -------------------------------- // 
   // success sing dialog ======================================//
		$('#sucess_dialog').dialog({
	      autoOpen: false,
	      modal: true,
		  buttons:{
	      "OK": function() {
 					$(this).dialog("close");
	        	      }
		  },
	      width: 300,
		  height: 200,
	      resizable: false
	    });


     	$("#find_place_form").submit(function()
			{
				$.post(this.action , $(this).serialize(), null, "script");
			    return false;
			});
		
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
      /* ---- google map location testing ----*/
        $('.distance').click(function() {
	      
	      getLocation();
	
	    });
	 /* ----- place -challenge - activity page ---click ----*/
	  $("#activity_header").click(function(){
		        var place_id = $("#hidden_place_id").val();
				// get the json data from chalenge based on challeng_id
				$.get(
		          '/user_activity/show', 
		          {
		            place_id: place_id
		          },
		          function(data) {
				 		alert("get the activities!");
				      $("#challenge_header_div").removeClass("verticali-secondary-selected2");
			          $("#challenge_header_div").addClass("verticali-secondary-tab2");
     				  $("#activity_header_div").removeClass("verticali-secondary-tab2");
			          $("#activity_header_div").addClass("verticali-secondary-selected2");
				    
					
		          }
		        );
			}

	     );
  	   
	  /* --- chalenge dialog open ----*/
	
	    $(".open_challenge").click(function(){
		        var chan_id = $(this).attr("chan_id");
				// get the json data from chalenge based on challeng_id
				//save the challenge id into the challenge dialog form to call again
				$('#challenge_id_input').attr("value",chan_id);
				$.getJSON(
		          '/challenges/show', 
		          {
		            ch_id: chan_id
		          },
		          function(json) {
					$("#challenge_points").text("+" + json.challenge.points);	
					$("#challenge_content").text(json.challenge.question);	
					$("#challenge_points_tag").attr("value",json.challenge.points);
					//$("#challenge_dialog").attr("title").val(json.challenge.name);
					//$('＃challenge_dialog').dialog('option', 'title', json.challenge.name);
					$("#challenge_dialog").dialog("open");
		          }
		        );
			}
	    
	     );
	// --- open check_in dialog ------//
	 	$(".checkin_challenge").click(function(){
		        var checkin_id = $(this).attr("checkin_id");
				// get the json data from chalenge based on challeng_id
				switch(checkin_id)
				{
					case "1":
					  $("#checkin_dialog").dialog("open");	
					  break;
					case "2":
					  $("#checkin_dialog_twee").dialog("open");						
					  break;
					case "3":
					  $("#checkin_dialog_tag").dialog("open");						
					  break;
					default:
					  alert("something wrong!");
				}
			}    
	     );
		// --- open check_in dialog ------//

	    $("#search_places").submit(function() {
	      search(place_name_selector, place_id_selector);
	    });

	    $('#save_place_dialog').dialog({
	      autoOpen: false,
	      buttons: {
	        Submit: function() {
		      $(this).find('form').submit( function(){	
			    $.post(this.action + '.json',
				$(this).serialize(),
				function(data)
				{
					$(place_name_selector).val(data.place.name);
					$(place_id_selector).val(data.place.id);
					$('#save_place_dialog').dialog('close');
				},
				'json'
				);
				return false;
			 });
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

	    $('.add_place_open').click(function()
	    {
        $('#save_place_dialog').dialog('open');
	      
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
	        var latLng = results[0].geometry.location;
	        var q = $('#search_places_name').val();

	        $.getJSON(
	          '/places/show', 
	          {
	            current_lat: latLng.lat(),
	            current_lng: latLng.lng(),
	            q: q 
	          },
	          function(json) {
	            showPlaces(json, place_name_selector, place_id_selector);
	          }
	        );
	      } else {
	        showPlaces([]);
	      }
	    });
	  }

	var showPlaces = function(places, place_name_selector, place_id_selector) {
   resetMap();

   if (places.length == 0) {
     $('.s_result').hide().filter('.error').show();
   } else {
     $('.s_result strong span').html(places.length);
     $('.s_result').hide().filter('.success').show();
     //var latLngBounds = new google.maps.LatLngBounds();

     $.each(places, function(i, data) {
       var place = data.place;
       var latLng = new google.maps.LatLng(place.latitue, place.longtitude);

       var marker = new google.maps.Marker({
         map: map,
         position: latLng, 
         title: place.name
       });

       markers.push(marker);

       google.maps.event.addListener(marker, 'click', function() {
         var content = $('<div/>', {
           'class': 'loc_content'
         })
         .append($('<h2/>', {
           click: function() {
             $(place_name_selector).val(place.name);
             $(place_id_selector).val(place.id);
             $('#select_place_dialog').dialog('close');
           },
           text: place.name
         }))
         .append($('<span/>', {
           text: place.street_address
         }))
         .append($('<span/>', {
           text: place.city_state_zip
         }));

         infoWindow.setContent(content.get(0));
         infoWindow.open(map, marker);
       });

      // latLngBounds.extend(latLng);
     });

     google.maps.event.addListenerOnce(map, 'zoom_changed', function() {
       if (map.getZoom() > maxZoom) {
         map.setZoom(maxZoom);
       }
     });

    // map.fitBounds(latLngBounds);
   }
 }




var setLatLng = function(lat, lng) {
	$('#place_lat').val(lat);
	$('#place_lng').val(lng);
}

{ var setPosition = function(position) {
   setLatLng(position.lat(), position.lng());
 }}

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



/* --- get current location ------*/
var getLocation = function()
{
	var lat;
	var lon;
	var lngSpan;
	var latSpan;
	var initialLocation;
	
	var gps = navigator.geolocation;
   // if device support html5 navigator 
	  if (gps)
	{
		// get location
		   gps.getCurrentPosition(
			function(pos){

					 lat = pos.coords.latitude;
					 lon = pos.coords.longitude
					 alert ("Position, Lat:" + lat + "Lon:" + lon);
					//save the latitude and longtitude into the hiddden form 
		
					$("#current_lat").attr("value",lat);
					$("#current_lng").attr("value",lon);
			
					// trigger the sumbit of hidden form
					//	$("#find_place_form").submit();
					// get the current postion from google map services
					var latlng = new google.maps.LatLng(lat,lon);
					var geocoder = new google.maps.Geocoder();
				    geocoder.geocode({'latLng': latlng}, function(results, status) {
				      if (status == google.maps.GeocoderStatus.OK) {
				        if (results[1]) {
  						  $('#current_location_span').empty();	
				          $('#current_location_span').append(results[1].formatted_address);
				        }
				      } else {
				        alert("Geocoder failed due to: " + status);
				      }
				    });
				   // to get the current places in place database 
				   	$.get("/places/show", { current_lat: lat, current_lng: lon } );
		
		
				}, 
	     function(error){
			alert("Got an error, code: " + error.code + " message: " + error.message);
			
		});
	}


				
			
			
	
}
	  return {
	    initializeAdmin: initializeAdmin,
	    initializeDialogs: initializeDialogs,
	    initializeShow: initializeShow,
    	getLocation: getLocation
	  };
	}();
