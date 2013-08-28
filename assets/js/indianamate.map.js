var indianamate = (function(window, document, undefined){
	var indianamate = {
		map: {},
		frames: [],
		marker: {},
		animationFrame: null,
		route: {},
		init: function(map, route, marker){
			if(!marker){
				indianamate.marker.setPosition = function(){};
			}
			else {
				this.marker = marker;
			}

			this.map = map;

			this.route = route;

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
			rtn.push(finishLatLng);

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

			path.setMap(this.map);
			map.panTo(frameB);
			this.marker.setPosition(frameB);
		},
		animate: function(){
			indianamate.step();
			if(indianamate.frames.length > 0){
				for(var i = 0, j = indianamate.route.length; i < j; i++){
					var mark = indianamate.route[i];
					if(indianamate.frames[0] == mark.LatLng && mark.stop){
						return;
					}
				}

				indianamate.animationFrame = requestAnimationFrame(indianamate.animate);
			}
		},
		stop: function(){
			cancelAnimationFrame(this.animationFrame);
		}
	};

	return indianamate;
})(this, this.document);
