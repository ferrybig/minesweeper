'use strict';
const Mouse = (function () {
	let down = false;
	let click = false;
	let focus = false;
	let x = 0;
	let y = 0;

	function setMouseData(_x, _y, _focus, _down, _click) {
		x = _x;
		y = _y;
		focus = _focus;
		down = _down;
		click = _click;
	}

	function getMouseDown() {
		return down;
	}

	function getMouseClick() {
		return click;
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

	return Object.seal({
		setMouseData, getMouseDown, getMouseClick, getApplicationFocus, getX, getY
	});
})();
