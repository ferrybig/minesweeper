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
			const sortedGrid = [];
			const length = width * height;
			let x = 0;
			let y = 0;
			for (let i = 0; i < length; i++) {
				this.grid.push(new Cell(x, y, false));
				x++;
				if (x >= width) {
					x = 0;
					y++;
				}
				randomGrid.push(Math.random());
				sortedGrid.push(i);
			}
			sortedGrid.sort((a, b) => randomGrid[a] < randomGrid[b]);
			let i = 0;
			for (i = 0; i < mines; i++) {
				this.setMineState(this.grid[sortedGrid[i]], true);
			}
			const maxLoop = Math.min(i + 17, length);
			for (; i < maxLoop; i++) {
				this.cheatMines.push(this.grid[sortedGrid[i]]);
			}
		}

		getWidth() {
			return width;
		}

		getHeigth() {
			return height;
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
	}

	let board;
	let minesLeft = -1;

	const hasBoard = () => {
		return board !== undefined;
	};

	const getBoard = () => {
		return board !== undefined;
	};

	const newBoard = (width, height, mines) => {
		board = new Plane(width, height, mines);
		minesLeft = mines;
	};

	const draw = graphics => {
		var scale = Math.min();
	};

	const init = canvas => {
		canvas.registerGraphicsUpdate(draw);
	};

	return Object.seal({
		hasBoard,
		getBoard,
		newBoard,
		init
	});
})();
