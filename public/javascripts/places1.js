var Places = function() {
  var defaultLatLng;
  var defaultZoom = 8;
  var geocoder;
  var infoWindow;
  var map;
  var marker;
  var markers;
  var maxZoom = 15;

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
  	
    defaultLatLng = new google.maps.LatLng(39.90871009616142, 116.39750584959984);
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

    $('.select_place_open').click(function() {
      $('#select_place_dialog').dialog('open');
    });

    $('#search_places').submit(function() {
      search(place_name_selector, place_id_selector);
    });

    $('#save_place_dialog').dialog({
      autoOpen: false,
      buttons: {
        Submit: function() {
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
        var latLng = results[0].geometry.location;
        var q = $('#search_places_name').val();

        $.getJSON(
          '/places.json', 
          {
            lat: latLng.lat(),
            lng: latLng.lng(),
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

  var setLatLng = function(lat, lng) {
    $('#place_lat').val(lat);
    $('#place_lng').val(lng);
  }

  var setPosition = function(position) {
    setLatLng(position.lat(), position.lng());
  }

  var showPlaces = function(places, place_name_selector, place_id_selector) {
    resetMap();

    if (places.length == 0) {
      $('.s_result').hide().filter('.error').show();
    } else {
      $('.s_result strong span').html(places.length);
      $('.s_result').hide().filter('.success').show();
      var latLngBounds = new google.maps.LatLngBounds();

      $.each(places, function(i, data) {
        var place = data.place;
        var latLng = new google.maps.LatLng(place.lat, place.lng);

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
          }))
          .append($('<a/>', {
            click: function() {
              var url = '/places/' + place.id + '/edit.js'

              $('#save_place_dialog').load(url, function() {
                $('#save_place_dialog').dialog('open');
              });
            },
            href: 'javascript:void(0);',
            text: 'Edit'
          }))
          .append($('<a/>', {
            click: function() {
              $('#flag_place_dialog').dialog('option', 'buttons', {
                Duplicate: function() {
                  flag(place.id, 'duplicate', marker);
                },
                Inappropriate: function() {
                  flag(place.id, 'inappropriate', marker);
                },
                'Non-existent': function() {
                  flag(place.id, 'nonexistent', marker);
                }
              });

              $('#flag_place_dialog').dialog('open');
            },
            href: 'javascript:void(0);',
            text: 'Flag'
          }));

          infoWindow.setContent(content.get(0));
          infoWindow.open(map, marker);
        });

        latLngBounds.extend(latLng);
      });

      google.maps.event.addListenerOnce(map, 'zoom_changed', function() {
        if (map.getZoom() > maxZoom) {
          map.setZoom(maxZoom);
        }
      });

      map.fitBounds(latLngBounds);
    }
  }

  return {
    initializeAdmin: initializeAdmin,
    initializeDialogs: initializeDialogs,
    initializeShow: initializeShow
  };
}();
