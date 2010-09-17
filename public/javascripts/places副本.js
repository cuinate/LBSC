var Places = 
{
 	var centerLatitude = 39.989059;  
	var centerLongitude = 116.351811;
	var startZoom = 13;
	var map;
	var geocoder;
	var description ='check in here';
	var infowindow;

 addmarker:function(latitude, longtitude,description)
{
	var location = new google.maps.LatLng(latitude, longtitude);
	
	var marker = new google.maps.Marker({
			            map: map, 
			            position:location
			        });
	map.addOverlay(marker);
	
}
 init:function(){
  
    geocoder = new google.maps.Geocoder();
    infowindow = new google.maps.InfoWindow();
    var latlng = new google.maps.LatLng(centerLatitude,centerLongitude);
    var myOptions = {
      zoom: 13,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map"), myOptions);
}


initializeDialogs:function()
{
		
		$("#dialog-form").dialog({
			autoOpen: false,
			height: 300,
			width: 350,
			modal: true,
			buttons: {
				Cancel: function() {
					$(this).dialog('close');
				}
			},
			close: function() {
				allFields.val('').removeClass('ui-state-error');
			}
		});
		
		$("select_palce").click(funtion(){window.alert("got you!");});
		$('#create-user')
			.button()
			.click(function() {
				$('#dialog-form').dialog('open');
			});
	    $('#search')
	    	.button()
	    	.click(function(){
	    		var address = document.getElementById("address").value;
			    geocoder.geocode( { 'address': address}, function(results, status) {
			      if (status == google.maps.GeocoderStatus.OK) {
			        map.setCenter(results[0].geometry.location);
			        var marker = new google.maps.Marker({
			            map: map, 
			            position: results[0].geometry.location
			        });
			        
			        set_infowindow_content(results[0]);
          			infowindow.open(map, marker);
			      } 
			      else {
			        alert("Geocode was not successful for the following reason: " + status);
			      }
				}
			);
	    		
	    	});

}

set_infowindow_content:function(data){
	var Geocoder_result = data;
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
              alert('you choosed :' + Geocoder_result.formatted_address );
              infowindow.close();
            },
            text: 'save'
          }))
     .append($('<a/>', {
        href: 'javascript:void(0);',
        click: function() {
	          infowindow.close();
	        },
        text: 'cancel'
      }));
      infowindow.setContent(content.get(0));	
}

gmap_init:function(){
	window.onload = init;
}
codeAddress:function() {
    var address = document.getElementById("address").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map, 
            position: results[0].geometry.location
        });
      } 
      else {
        alert("Geocode was not successful for the following reason: " + status);
      }
	});
}

}	

$(document).ready(function(){
	Places.gmap_init();
	Places.initializeDialogs();
	}
);