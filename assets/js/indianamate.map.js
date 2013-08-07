var indianamate = (function(window, document, undefined){
	var indianamate = {
		frames: [],
		marker: {},
		animationFrame: null,
		init: function(route, marker){
			if(!marker){
				indianamate.marker.setPosition = function(){};
			}
			else {
				this.marker = marker;
			}

			for(var i = 0, j = route.length; i < (j - 1); i++){
				this.frames = this.frames.concat(this.getFramesFromPath(route[i].LatLng, route[i+1].LatLng));
			}
		},
		getFramesFromPath: function(startLatLng, finishLatLng, numFrames){
			numFrames = numFrames || 125;
			var rtn = [],
				addx = (finishLatLng.lat() - startLatLng.lat()) / numFrames,
				addy = (finishLatLng.lng() - startLatLng.lng()) / numFrames;

			for(var i = 0; i < numFrames; i++) {
				rtn.push(new google.maps.LatLng(startLatLng.lat() + i * addx, startLatLng.lng() + i * addy));
			}

			return rtn;
		},
		step: function(){
			var frameA = this.frames.shift(),
				frameB = this.frames[0],
				path = new google.maps.Polyline({
					path: [frameA, frameB],
					strokeColor: '#c00',
					strokeOpacity: 1,
					strokeWeight: 8,
					visible: true
				});

			path.setMap(map);
			map.panTo(frameB);
			this.marker.setPosition(frameB);
		},
		animate: function(){
			indianamate.step();
			if(indianamate.frames.length > 0){
				indianamate.animationFrame = requestAnimationFrame(indianamate.animate);
			}
		},
		stop: function(){
			cancelAnimationFrame(this.animationFrame);
		}
	};

	return indianamate;
})(this, this.document);

// enable the visual refresh
google.maps.visualRefresh = true;

// setup our map objects
var map;

// initialize the map
google.maps.event.addDomListener(window, 'load', function(){
	var mapOptions = {
			center: new google.maps.LatLng(0,0),
			zoom: 5,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		},
		markers = [];

	// draw map
	map = new google.maps.Map(document.getElementById('indianamate-map'), mapOptions);

	// plot markers + lines
	for(var i = 0, j = key_locations.length; i < j; i++){
		e = key_locations[i];
		markers.push(new google.maps.Marker({
			position: e.LatLng,
			map: map,
			title: e.formatted_address
		}));
	}

	indianamate.init(key_locations, new google.maps.Marker({
		position: new google.maps.LatLng(0,0),
		map: map,
		title: "indianamate"
	}));
	indianamate.animate();
});
