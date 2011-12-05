/*
 * jQuery Geolocation helper v@VERSION
 * https://github.com/sash/jquery-geolocation
 *
 * Copyright 2011 Alexander (SASh) Alexiev
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: @DATE
 */
(function(jQuery,undefined){
	// Does the same as navigator.geolocation.getCurrentPosition
	// except when minAccuracy option is provided.
	// In the latter case the timeout option is required (and if missing is assumed to be 10 seconds) and
	// navigator.geolocation.watchPosition is used to wait for accurate enough position before 
	// triggering the success or error callbacks
	jQuery.getCurrentPosition = function(success, fail, options){
		fail = fail || function(){};
		success = success || function(){};
		options = options || {};
		
		if (navigator.geolocation) {
			if (typeof options.minAccuracy != undefined){
				var timeout = options.timeout || 10000;
				var minAccuracy = options.minAccuracy;
				var watchPos=null;
				var best=null;
				var cancel = function(){
					if (watchPos!=null){
						navigator.geolocation.clearWatch(watchPos);
						watchPos=null;
						return true;
					}
					return false;
				}
				watchPos = navigator.geolocation.watchPosition(function(position){
					if (position.coords.accuracy<=minAccuracy){
						best = null;
						cancel();
						success(position);
					}
					else{
						if (best == null || best.coords.accuracy > position.coords.accuracy){
							best = position;
						}
					}
				}, function(message){
					cancel();
					if (best!=null)	success(best);
					else fail(message);
				}, options);

				setTimeout(function(){
					if (cancel()){
						if (best!=null)	success(best);
						else fail({'message':'timeout'});
					}
				}, timeout);

			}
			else{
				navigator.geolocation.getCurrentPosition(success,fail,options);
			}
		} else {
			fail({'message': 'not supported'});
		}
	}
})(jQuery);