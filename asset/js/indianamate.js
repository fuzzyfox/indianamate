/*
 * indianamate.js
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
(function(window, document, undefined){
	// indianamate requires google maps v3... 
	// check we have that before we start
	if(!window.google){
		window.Indianamate = {
			isSupported: false
		};

		// prevent lots of un-needed errors
		var methods = ("").split(/\s+/);

		while(methods.length){
			window.Indianamate[methods.shift()] = function(){};
		}

		return;
	}

	var forEach = Array.prototype.forEach,
		slice = Array.prototype.slice,
		hasOwn = Object.prototype.hasOwnProperty,
		toString = Object.prototype.toString,
		google = window.google,
		requestAnimFrame = (function(){
			return window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function( callback, element ) {
						window.setTimeout( callback, 16 );
					};
		}()),
		movingMarker;

	// Declare constructor
	// Returns an instacne object
	Indianamate = function(map, config){
		return new Indianamate.prototype.init(map, config || null);
	};

	// Indianamate API version
	Indianamate.version = "0.1";

	// Boolean flag allowing client to determine if Indianamate will work
	Indianamate.isSupported = true;

	// Definition of the new prototype for constructor
	Indianamate.prototype = {
		config: {},
		init: function(map, config){
			if(!map){
				return;
			}
			Indianamate.prototype.map = map;

			if(!config || !config.route){
				return;
			}

			for(var key = 0, len = config.route.length; key < len; key++){
				config.route[key].LatLng = new google.maps.LatLng(config.route[key].LatLng[0], config.route[key].LatLng[1]);
			}

			Indianamate.prototype.config = config;

			if(config.marker_url){
				movingMarker = new google.maps.Marker({
					position: new google.maps.LatLng(0,0),
					map: map,
					icon: config.marker_url
				});
			}
		}
	};

	// Extend constructor to allowing chaining methods to instacnes.
	Indianamate.prototype.init.prototype = Indianamate.prototype;

	Indianamate.forEach = function(obj, fn, context){
		if(!obj || !fn){
			return {};
		}

		context = context || null;

		var key, len;

		if(forEach && obj.forEach === forEach){
			return obj.forEach(fn, context);
		}

		if(toString.call(obj) === "[object NodeList]"){
			for(key = 0, len = obj.length; key < len; key++){
				fn.call(context, obj[key], key, obj);
			}
			return obj;
		}

		for(key in obj){
			if(hasOwn.call(obj, key)){
				fn.call(context, obj[key], key, obj);
			}
		}
		return obj;
	};

	Indianamate.extend = function(obj){
		var dest = obj, src = slice.call(arguments, 1);

		Indianamate.forEach(src, function(copy){
			for(var prop in copy){
				dest[prop] = copy[prop];
			}
		});
	};

	/*
		Plotting
	 */
	Indianamate.extend(Indianamate.prototype, {
		getFramesFromPath: function(startLatLng, finishLatLng, numFrames){
			numFrames = numFrames || 125;
			var rtn = [],
				addx = (finishLatLng.lat() - startLatLng.lat()) / numFrames,
				addy = (finishLatLng.lng() - startLatLng.lng()) / numFrames;

			for(var i = 0; i < numFrames; i++) {
				rtn.push(new google.maps.LatLng(startLatLng.lat() + i * addx, startLatLng.lng() + i * addy));
			}

			return rtn;
		}
	});

	/*
		Animations
	 */
	Indianamate.extend(Indianamate.prototype, (function(self, Indianamate){
		var animationFrame = null,
			frames = [];

		console.log(self);
		Indianamate.forEach(self.config.route, function(e, i, a){
			frames = frames.concat(self.getFramesFromPath(e.LatLng, a[i+1].LatLng));
			console.log(self.getFramesFromPath(e.LatLng, a[i+1].LatLng));
		});

		return {
			step: function(){
				var frameA = frames.shift(),
					frameB = frames[0],
					path = new google.maps.Polyline({
						path: [frameA, frameB],
						strokeColor: '#c00',
						strokeOpacity: 1,
						strokeWeight: 8,
						visible: true
					});

				alert(Indianamate.map);
				path.setMap(Indianamate.map);
				Indianamate.map.panTo(frameB);
				
			},
			animate: function(){
				this.step();
			},
			tmp: function(){
				console.log(self, Indianamate);
			}
		};
	})(Indianamate.prototype, Indianamate));

	window.Indianamate = Indianamate;
})(this, this.document);