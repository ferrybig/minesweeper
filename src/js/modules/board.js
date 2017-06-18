/* global Mouse, Plane */

'use strict';

const Board = (function() {
	let board;
	let minesLeft = -1;
	let canvas;
	let scale = 1;

	const hasBoard = () => {
		return board !== undefined;
	};

	const getBoard = () => {
		return board;
	};

	const newBoard = (width, height, mines) => {
		board = new Plane(width, height, mines);
		minesLeft = mines;
	};

	const update = () => {
		const board = getBoard();
		const middleX = canvas.getWidth() / 2;
		const middleY = canvas.getHeight() / 2;
		const leftTopX = middleX - getBoard().getWidth() / 2 * scale;
		const leftTopY = middleY - getBoard().getHeight() / 2 * scale;
		scale = Math.min(canvas.getWidth() / (board.getWidth() + 2), canvas.getHeight() / (board.getHeight() + 2));
		for (let y = 0; y < board.getHeight(); y++) {
			for (let x = 0; x < board.getWidth(); x++) {
				if (board.getField(x, y).update(board, leftTopX + x * scale, leftTopY + y * scale, scale)) {
					board.registerFirstClick();
				}
			}
		}
	};

	const draw = graphics => {
		if (!hasBoard()) {
			return;
		}
		const board = getBoard();
		const middleX = canvas.getWidth() / 2;
		const middleY = canvas.getHeight() / 2;
		const leftTopX = middleX - getBoard().getWidth() / 2 * scale;
		const leftTopY = middleY - getBoard().getHeight() / 2 * scale;
		for (let y = 0; y < board.getHeight(); y++) {
			for (let x = 0; x < board.getWidth(); x++) {
				board.getField(x, y).draw(graphics, leftTopX + x * scale, leftTopY + y * scale, scale);
			}
		}
	};

	const init = _canvas => {
		canvas = _canvas;
		canvas.registerGraphicsUpdate(draw);
		canvas.registerPhysicsUpdate(update);
		newBoard(16, 16, 40);
	};

	return Object.seal({
		hasBoard,
		getBoard,
		newBoard,
		init
	});
})();
