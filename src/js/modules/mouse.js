'use strict';
const Mouse = (function() {
	let down = false;
	let click = false;
	let focus = false;
	let x = 0;
	let y = 0;
	let right = false;

	function setMouseData(_x, _y, _focus, _down, _click, _right) {
		x = _x;
		y = _y;
		focus = _focus;
		down = _down;
		click = _click;
		right = _right;
	}

	function getMouseDown() {
		return down;
	}

	function getMouseClick() {
		return click;
	}

	function getRight() {
		return right;
	}

	function getApplicationFocus() {
		return focus;
	}

	function getX() {
		return x;
	}
	function getY() {
		return y;
	}
	
	function init(canvas) {
		canvas.registerPhysicsUpdateLast(() => {
			click = false;
		});
	}

	return Object.seal({
		setMouseData,
		getMouseDown,
		getMouseClick,
		getRight,
		getApplicationFocus,
		getX,
		getY,
		init
	});
})();
