var places = function(){
 	var centerLatitude = 39.989059;  
	var centerLongitude = 116.351811;
	var startZoom = 13;
	var map;
	var geocoder;
	var description ='check in here';
	var infowindow;

function addmarker(latitude, longtitude,description){
	var location = new google.maps.LatLng(latitude, longtitude);
	
	var marker = new google.maps.Marker({
			            map: map, 
			            position:location
			        });
	map.addOverlay(marker);
	
}
function init(){
  
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


var initializeDialogs = function()
{	
	
	$('#select_place_dialog').dialog({
      autoOpen: false,
      modal: true,
      width: 720,
	  resizeable: false
    });
	
	$(".select_place").click(function() {
		$('#select_place_dialog').dialog('open');
           alert("you got me!");
    });
	
	

}

var set_infowindow_content = function(data){
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

var gmap_init = function(){
	window.onload = init;
}
var codeAddress = function() {
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
return{
    initializeDialogs: initializeDialogs,
    gmap_init:gmap_init,
    codeAddress:codeAddress
};
}();
