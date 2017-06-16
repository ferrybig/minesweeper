'use strict';
const Canvas = (function() {
	let canvas;
	let graphics;
	let lastFrameTime;
	let targetPhysicsRate = 1000 / 60; // Run physics at 60 TPS
	let targetFrameRate = 1000 / 60; // Run frames at 60 FPS
	let tickCounter = 0;
	let mouseClicked = false;
	let mouseDown = false;
	const loop = {
		graphics: [],
		update: []
	};

	/**
	 * Using requestAnimationFrame instead of a simple `setTimeout` allows us to
	 *  get higher performance, by not blocking the browser when its trying to
	 *  render a frame
	 */
	const requestAnimFrame =
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, targetFrameRate);
		};

	/**
	 * Runs a update tick of the physics calculations 
	 */
	function update() {
		for (var i = 0; i < loop.update.length; i++) {
			loop.update[i](tickCounter);
		}
		tickCounter++;
		mouseClicked = false;
	}

	/**
	 * Runs a update tick of the graphical GUI 
	 */
	function draw() {
		for (var i = 0; i < loop.graphics.length; i++) {
			loop.graphics[i](tick);
		}
	}

	function registerUpdateFunction(func) {
		loop.update.push(func);
	}

	function registerGraphicsUpdate(func) {
		loop.update.push(func);
	}

	function init(elm, setMouseData) {
		canvas = elm;
		graphics = canvas.getContext('2d');
		let lastDownTarget = canvas;
		document.addEventListener(
			'mousedown',
			function(event) {
				lastDownTarget = event.target;
				mouseDown = true;
				mouseClicked = true;
				var mouseX, mouseY;
				if (event.offsetX) {
					mouseX = event.offsetX;
					mouseY = event.offsetY;
				} else if (event.layerX) {
					mouseX = event.layerX;
					mouseY = event.layerY;
				}
				setMouseData(mouseX, mouseY, lastDownTarget === canvas, mouseDown, mouseClicked);
			},
			false
		);
		document.addEventListener(
			'keydown',
			function(event) {
				if (lastDownTarget === canvas) {
					const code = event.keyCode;
				}
			},
			false
		);
		document.addEventListener(
			'keyup',
			function(event) {
				var code = event.keyCode;
			},
			false
		);
		document.addEventListener(
			'mousemove',
			function(event) {
				if (canvas === event.target) {
					var mouseX, mouseY;
					if (event.offsetX) {
						mouseX = event.offsetX;
						mouseY = event.offsetY;
					} else if (event.layerX) {
						mouseX = event.layerX;
						mouseY = event.layerY;
					}
					setMouseData(mouseX, mouseY, lastDownTarget === canvas, mouseDown, mouseClicked);
				}
			},
			false
		);
		tick();
	}

	function tick() {
		var timeInMs = Date.now();
		if (lastFrameTime === undefined || timeInMs - lastFrameTime > 400) {
			// Either missed to many frames, or we are first starting
			// Adjust the frames by a few MS to prevent clock skew from messing with the time
			lastFrameTime = timeInMs - targetPhysicsRate / 10;
			update();
		} else {
			while (timeInMs - lastFrameTime > targetPhysicsRate) {
				update();
				lastFrameTime += targetPhysicsRate;
			}
		}
		draw();
		requestAnimFrame(tick);
	}

	return Object.seal({
		registerUpdateFunction,
		registerGraphicsUpdate,
		init
	});
})();
