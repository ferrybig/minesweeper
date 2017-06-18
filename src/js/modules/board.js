/* global Mouse */

'use strict';

const Board = (function() {
	const state = Object.seal({
		FLAGGED: 0,
		UNKNOWN: 1,
		CLOSED: 2,
		OPEN: 3
	});

	class Cell {
		constructor(x, y, mine) {
			this.x = x;
			this.y = y;
			this.mine = mine;
			this.state = state.CLOSED;
			this.nearby = 0;
		}

		getX() {
			return this.x;
		}

		getY() {
			return this.y;
		}

		getState() {
			return this.state;
		}

		isMine() {
			return this.mine;
		}

		setMine(mine) {
			this.mine = mine;
		}

		setState(state) {
			this.state = state;
		}

		getNeigbourMines() {
			return this.nearby;
		}

		setNeigbourMines(nearby) {
			this.nearby = nearby;
		}

		draw(graphics, x, y, scale) {
			let text;
			switch (this.state) {
				case state.OPEN:
					if (this.mine) {
						text = '💣';
					} else {
						text = this.nearby + '';
					}

					break;
				case state.FLAGGED:
					text = '🚩';

					break;
				case state.UNKNOWN:
					text = '❓';

					break;
			}
			if (text) {
				graphics.textAlign = 'center';
				graphics.textBaseline = 'middle';
				graphics.font = Math.round(0.7 * scale) + 'px serif';
				graphics.fillText(text, x + 0.5 * scale, y + 0.5 * scale);
			}
			graphics.strokeRect(x, y, scale, scale);
		}

		open(board) {
			if (this.state !== state.CLOSED) {
				return;
			}
			this.state = state.OPEN;
			if (this.nearby === 0) {
				board.triggerOpenWave(this.x, this.y);
			}
			if (this.mine) {
				board.triggerMineWave(this.x, this.y);
			}
		}

		tryFlag() {
			switch (this.state) {
				case state.CLOSED:
					this.state = state.FLAGGED;

					break;
				case state.FLAGGED:
					this.state = state.UNKNOWN;

					break;
				case state.UNKNOWN:
					this.state = state.CLOSED;

					break;
			}
		}

		update(board, x, y, scale) {
			if (Mouse.getMouseClick()) {
				const mouseX = Mouse.getX();
				const mouseY = Mouse.getY();
				if (x <= mouseX && mouseX < x + scale && y <= mouseY && mouseY < y + scale) {
					if (Mouse.getRight()) {
						this.tryFlag();
					} else {
						if (this.singleClick) {
							board.triggerOpenWave(this.x, this.y);
						} else {
							this.open(board);
							this.singleClick = true;
						}
					}
				} else {
					this.singleClick = false;
				}
			}
		}
	}

	class Plane {
		constructor(width, height, mines) {
			this.width = width;
			this.height = height;
			this.mines = mines;
			this.grid = [];
			this.cheatMines = [];
			this.dummy = new Cell(-1, -1);
			const randomGrid = [];
			const length = width * height;
			let x = 0;
			let y = 0;
			for (let i = 0; i < length; i++) {
				const cell = new Cell(x, y, false);
				this.grid.push(cell);
				x++;
				if (x >= width) {
					x = 0;
					y++;
				}
				randomGrid.push({ cell, random: Math.random() });
			}
			randomGrid.sort((a, b) => (a.random > b.random ? 1 : a.random < b.random ? -1 : 0));
			let i = 0;
			for (i = 0; i < mines; i++) {
				this.setMineState(randomGrid[i].cell, true);
			}
			const maxLoop = Math.min(i + 17, length);
			for (; i < maxLoop; i++) {
				this.cheatMines.push(randomGrid[i].cell);
			}
		}

		getWidth() {
			return this.width;
		}

		getHeight() {
			return this.height;
		}

		setMineState(cell, mine) {
			if (cell.isMine() === mine) return;
			cell.setMine(mine);
			const change = mine ? 1 : -1;
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					const neigbour = this.getField(cell.getX() + x, cell.getY() + y);
					neigbour.setNeigbourMines(neigbour.getNeigbourMines() + change);
				}
			}
		}

		getField(x, y) {
			if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
				return this.grid[y * this.width + x];
			} else {
				return this.dummy;
			}
		}

		triggerOpenWave(x, y) {
			const cell = this.getField(x, y);
			if (cell.state !== state.OPEN && cell.state !== state.CLOSED) {
			}
			window.setTimeout(() => {
				const fields = [
					this.getField(x - 1, y - 1),
					this.getField(x, y - 1),
					this.getField(x + 1, y - 1),

					this.getField(x - 1, y),
					this.getField(x + 1, y),

					this.getField(x - 1, y + 1),
					this.getField(x, y + 1),
					this.getField(x + 1, y + 1)
				];
				let flags = 0;
				for (let i = 0; i < fields.length; i++) {
					if (fields[i].getState() === state.FLAGGED) {
						flags++;
					}
				}
				if (flags === cell.nearby) {
					for (let i = 0; i < fields.length; i++) {
						fields[i].open(this);
					}
				}
			}, 50);
		}

		triggerMineWave(x, y) {}
	}
	return (function() {
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
					board.getField(x, y).update(board, leftTopX + x * scale, leftTopY + y * scale, scale);
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
			graphics.fillStyle = 'lightgreen';
			graphics.fillRect(leftTopX, leftTopY, board.getWidth() * scale, board.getHeight() * scale);
			graphics.fillStyle = 'black';
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
})();
