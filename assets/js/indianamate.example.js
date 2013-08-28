function constuctInfoWindow(key_location){
	return '<div class="make">' +
		'<div class="make-info">' +
		'<a href="https://fuzzyfox.makes.org/thimble/why-im-a-webmaker" class="title">Why I\'m a Webmaker</a>' +
		'</div>' +
		'<div class="btn-container">'+
		'<a href="https://fuzzyfox.makes.org/thimble/why-im-a-webmaker/remix" class="btn"><span class="icon-code-fork"></span> Remix</a>' +
		'<a href="#" class="btn">Next</a>' +
        '</div>' +
		'</div>';
}

// enable the visual refresh
google.maps.visualRefresh = true;

// setup our map objects
var map,
	markers = [];

// initialize the map
google.maps.event.addDomListener(window, 'load', function(){
	var mapOptions = {
			center: new google.maps.LatLng(0,0),
			zoom: 5,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		},
		infowindow = new google.maps.InfoWindow();

	// draw map
	map = new google.maps.Map(document.getElementById('indianamate-map'), mapOptions);

	$.getJSON('config.json', function(config){
		var key_locations = config.route,
			i, j;

		for(i = 0, j = key_locations.length; i < j; i++){
			var LatLng = key_locations[i].LatLng;
			key_locations[i].LatLng = new google.maps.LatLng(LatLng[0], LatLng[1]);
		}

		for(i = 0, j = key_locations.length; i < j; i++){
			marker = new google.maps.Marker({
				position: key_locations[i].LatLng,
				map: map,
				icon: "asset/img/pin-event.png"
			});

			markers.push(marker);

			// var content = constuctInfoWindow(key_locations[i]);

			// google.maps.event.addListener(marker, 'click', (function(marker, content){
			// 	return function(){
			// 		infowindow.setContent(content);
			// 		infowindow.open(map, marker);
			// 	};
			// })(marker, content));
		}

		indianamate.init(map, key_locations, new google.maps.Marker({
			position: new google.maps.LatLng(0,0),
			map: map,
			title: "indianamate",
			icon: "assets/img/indiana-surman.png"
		}));
		indianamate.animate();
	});
});