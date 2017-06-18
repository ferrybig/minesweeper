/* global Canvas, Mouse, Board, Particle */

'use strict';

(function() {
	var oldLoad = window.onload;
	window.onload = function() {
		if (oldLoad) oldLoad();

		console.log('Initizing...');
		Board.init(Canvas);
		Mouse.init(Canvas);
		Particle.init(Canvas);
		Canvas.init(document.getElementById('game'), Mouse.setMouseData);
	};
})();
