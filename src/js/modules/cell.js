/* global State, Mouse */

'use strict';

class Cell {
	constructor(x, y, mine) {
		this.x = x;
		this.y = y;
		this.mine = mine;
		this.state = State.CLOSED;
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
			case State.OPEN:
				if (this.mine) {
					text = '💣';
				} else {
					text = this.nearby + '';
				}

				break;
			case State.FLAGGED:
				text = '🚩';

				break;
			case State.UNKNOWN:
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
		if (this.state !== State.CLOSED) {
			return;
		}
		this.state = State.OPEN;
		if (this.nearby === 0) {
			board.triggerOpenWave(this.x, this.y);
		}
		if (this.mine) {
			board.triggerMineWave(this.x, this.y);
		}
	}

	tryFlag() {
		switch (this.state) {
			case State.CLOSED:
				this.state = State.FLAGGED;

				break;
			case State.FLAGGED:
				this.state = State.UNKNOWN;

				break;
			case State.UNKNOWN:
				this.state = State.CLOSED;

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
