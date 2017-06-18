/* global State, Cell */

'use strict';
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

	hasFirstClicked() {
		return this.firstClicked;
	}

	registerFirstClick() {
		this.firstClicked = true;
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
		if (cell.state !== State.OPEN && cell.state !== State.CLOSED) {
			return;
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
				if (fields[i].getState() === State.FLAGGED) {
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

	useMineMove(x, y) {
		console.log('Minemove activated!');
		this.registerFirstClick();
		const fields = [
			this.getField(x, y),
			this.getField(x - 1, y),
			this.getField(x + 1, y),

			this.getField(x, y - 1),
			this.getField(x - 1, y - 1),
			this.getField(x + 1, y - 1),

			this.getField(x, y + 1),
			this.getField(x - 1, y + 1),
			this.getField(x + 1, y + 1)
		];
		const length = Math.min(fields.length, this.cheatMines.length);
		for (let i = 0; i < length; i++) {
			this.setMineState(fields[i], false);
			this.setMineState(this.cheatMines[i], true);
		}
	}
}
