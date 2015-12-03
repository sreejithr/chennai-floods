var Chennai = function() {
    var self = this;

    this.displayAndGetMap = function(el) {
        return new google.maps.Map(el, {zoom: 12, center: new google.maps.LatLng(13.0827, 80.2707)});
    }

    this.addDataToMap = function(map, geojson) {
        map.data.addGeoJson(geojson);
    }

    this.styleMap = function(map) {
        map.data.setStyle({
            strokeColor: '#2B70E2',
            strokeWeight: 3
        });

        map.data.addListener('mouseover', function(event) {
            map.data.revertStyle();
            map.data.overrideStyle(event.feature, {strokeColor: 'red'});
        });
    }


    this.configureSearchBox = function(map, el) {
        var input = document.getElementById('place-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias search within current bounding box
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
              return;
            }

            // Clear out the old markers.
            markers.forEach(function(marker) {
              marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                // Create a marker for each place.
                markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });
    }

    this.render = function() {
        var self = this;
        var map = self.displayAndGetMap(document.getElementById("map"));
        var geoJSONUrl = "/chennai-floods/data/chennai-dec2.geojson";

        $.ajax({
            url: geoJSONUrl,
        }).done(function(geoJSONString) {
            self.addDataToMap(map, geoJSONString);
        });

        self.styleMap(map);
        self.configureSearchBox(map, document.getElementById('place-input'));
    }
    
    this.render();
}