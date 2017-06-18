'use strict';
const Canvas = (function() {
	let canvas;
	let graphics;
	let lastFrameTime;
	const targetPhysicsRate = 1000 / 30; // Run physics at 60 TPS
	const targetFrameRate = 1000 / 30; // Run frames at 60 FPS
	let tickCounter = 0;
	let mouseClicked = false;
	let mouseDown = false;
	let width;
	let height;
	const loop = {
		graphics: [],
		update: [],
		updateLast: []
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
		for (let i = 0; i < loop.update.length; i++) {
			loop.update[i](tickCounter);
		}
		for (let i = 0; i < loop.updateLast.length; i++) {
			loop.updateLast[i](tickCounter);
		}
		tickCounter++;
		mouseClicked = false;
	}

	/**
	 * Runs a update tick of the graphical GUI 
	 */
	function draw() {
		for (var i = 0; i < loop.graphics.length; i++) {
			loop.graphics[i](graphics, 0.0);
		}
	}

	function registerPhysicsUpdate(func) {
		loop.update.push(func);
	}
	
	function registerPhysicsUpdateLast(func) {
		loop.updateLast.push(func);
	}

	function registerGraphicsUpdate(func) {
		loop.graphics.push(func);
	}

	function init(_canvas, setMouseData) {
		canvas = _canvas;
		width = canvas.width;
		height = canvas.height;
		graphics = canvas.getContext('2d');
		let lastDownTarget = canvas;
		addEvent(
			canvas,
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
				setMouseData(mouseX, mouseY, lastDownTarget === canvas, mouseDown, mouseClicked, event.button !== 0);
				event.preventDefault();
			}
		);
		addEvent(
			canvas,
			'contextmenu',
			function(event) {
				event.preventDefault();
				return false;
			}
		);
		addEvent(
			document,
			'keydown',
			function(event) {
				if (lastDownTarget === canvas) {
					const code = event.keyCode;
				}
			}
		);
		addEvent(
			document,
			'keyup',
			function(event) {
				var code = event.keyCode;
			}
		);
		addEvent(
			document,
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
					setMouseData(
						mouseX,
						mouseY,
						lastDownTarget === canvas,
						mouseDown,
						mouseClicked,
						event.button !== 0
					);
				}
			}
		);
		addEvent(window, 'resize', resize);
		tick();
		resize();
	}

	function resize() {
		setWidth(canvas.offsetWidth);
		setHeight(canvas.offsetHeight);
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

	function getWidth() {
		return width;
	}

	function getHeight() {
		return height;
	}

	function setWidth(_width) {
		width = _width;
		canvas.width = width;
	}

	function setHeight(_height) {
		height = _height;
		canvas.height = height;
	}

	function addEvent(object, type, callback) {
		if (object === null || typeof object === 'undefined') return;
		if (object.addEventListener) {
			object.addEventListener(type, callback, false);
		} else if (object.attachEvent) {
			object.attachEvent('on' + type, callback);
		} else {
			object['on' + type] = callback;
		}
	}

	return Object.seal({
		registerPhysicsUpdate,
		registerGraphicsUpdate,
		init,
		getWidth,
		getHeight,
		registerPhysicsUpdateLast
	});
})();
