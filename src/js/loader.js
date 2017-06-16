/* global Canvas, Mouse */

'use strict';

(function() {
	var oldLoad = window.onload;
	window.onload = function() {
		if (oldLoad) oldLoad();

		console.log('Initizing...');
		Canvas.init(document.getElementById('game'), Mouse.setMouseData);
	};
})();
