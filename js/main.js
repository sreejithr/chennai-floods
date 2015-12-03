var Chennai = function() {
    var self = this;

    this.displayAndGetMap = function(el) {
        return new google.maps.Map(el, {zoom: 12, center: new google.maps.LatLng(13.0827, 80.2707)});
    }

    this.addDataToMap = function(map, geoJSONString) {
        var geojson = JSON.parse(geoJSONString);
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

    this.render = function() {
        var self = this;
        var map = self.displayAndGetMap(document.getElementById("map"));
        var geoJSONUrl = "/chennai-floods/chennai-dec2.geojson";

        $.ajax({
            url: geoJSONUrl,
        }).done(function(geoJSONString) {
            self.addDataToMap(map, geoJSONString);
        });

        self.styleMap(map);

        var input = document.getElementById('place-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    }
    
    this.render();
}