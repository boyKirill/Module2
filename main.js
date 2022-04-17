const GameState = {
	NOT_RUNNING: 0,
	RUNNING: 1,
};

let game = {
	steps: [],
	data: [],
	container: document.getElementById('game-container'),
	score: 0,
	record: 0,
	state: GameState.NOT_RUNNING,
	startTime: 0,
	timeStampsArr: [],
	gR: undefined,
	gC: undefined,

	start: function () {
		this.startTime = Date.now();
		this.score = 0;
		this.state = GameState.RUNNING;

		let activeCells = document.querySelectorAll('.active-cell');

		for (const activeCell of activeCells) {
			activeCell.remove();
		}

		for (let r = 0; r < 5; r++) {
			this.data[r] = [];

			for (let c = 0; c < 5; c++) {
				this.data[r][c] = 0;
			}
		}

		this.dataView();
		this.randomNum();
		this.randomNum();
	},


	randomNum: function () {
		while (true) {

			this.gR = Math.floor(Math.random() * 5);
			this.gC = Math.floor(Math.random() * 5);

			let div = document.getElementById('c' + this.gR + this.gC);

			if (this.data[this.gR][this.gC] === 0) {
				this.data[this.gR][this.gC] = Math.random() > 0.1 ? 2 : 4;

				this.addActiveCell(div);

				break;
			}
		}
	},

	addActiveCell: function (currentCell) {
		const activeCell = document.createElement("div");

		activeCell.classList.add('active-cell', 'new-cell', 'cell', 'n' + this.data[this.gR][this.gC]);
		activeCell.id = 'v' + this.gR + this.gC;
		activeCell.innerHTML = this.data[this.gR][this.gC];

		activeCell.style.left = currentCell.offsetLeft + 'px';
		activeCell.style.top = currentCell.offsetTop + 'px';

		this.container.appendChild(activeCell);
	},

	dataView: function () {
		this.animate();

		const gamewinBlock = document.getElementById('gamewin');
		const gameoverBlock = document.getElementById('gameover');

		document.getElementById('score_1').innerHTML = this.score;

		if (this.isGameWin()) {
			this.secundomer();
			document.getElementById('score_3').innerHTML = this.score;

			if (this.score > this.record) {
				this.record = this.score;
				document.getElementById('record_1').innerHTML = this.record;
				document.getElementById('record_3').innerHTML = this.record;
			}

			gamewinBlock.style.display = 'block';
			gamewinBlock.style.opacity = '0.7';
			gamewinBlock.style.pointerEvents = 'auto';
		} else {
			gamewinBlock.style.opacity = '0';
			gamewinBlock.style.pointerEvents = 'none';
		}

		if (this.isGameOver()) {
			document.getElementById('score_2').innerHTML = this.score;

			if (this.score > this.record) {
				this.record = this.score;
				document.getElementById('record_1').innerHTML = this.record;
				document.getElementById('record_2').innerHTML = this.record;
			}

			gameoverBlock.style.display = 'block';
			gameoverBlock.style.opacity = '0.7';
			gameoverBlock.style.pointerEvents = 'auto';
		} else {
			gameoverBlock.style.opacity = '0';
			gameoverBlock.style.pointerEvents = 'none';
		}
	},

	secundomer: function () {
		const pastTime = Date.now() - this.startTime;

		this.timeStampsArr.push(pastTime); // пушим в массив

		let m = Math.floor(pastTime / 1000 / 60);

		let s = Math.floor(pastTime / 1000 % 60);

		document.getElementById('winTime').innerHTML = `Время: <span>${m}мин. ${s}сек.</span>`;

		// сортируем массив от меньшего количества миллисекунд к большему
		this.timeStampsArr.sort(function (a, b) {
			return a - b;
		});

		// чистим нашу таблицу
		document.querySelector('.table__body').innerHTML = "";

		for (let time of this.timeStampsArr) {
			let m = Math.floor(time / 1000 / 60);
			let s = Math.floor(time / 1000 % 60);

			const li = document.createElement('li');
			li.textContent = `${m}мин. ${s}сек.`;

			document.querySelector('.table__body').appendChild(li);
		}
	},

	isGameWin: function () {
		for (let r = 0; r < 5; r++) {
			for (let c = 0; c < 5; c++) {
				if (this.data[r][c] === 2048) {
					return true;
				}
			}
		}
	},

	isGameOver: function () {
		for (let r = 0; r < 5; r++) {
			for (let c = 0; c < 5; c++) {
				if (this.data[r][c] === 0) {
					return false;
				}

				if (c < 4) {
					if (this.data[r][c] === this.data[r][c + 1]) {
						return false;
					}
				}

				if (r < 4) {
					if (this.data[r][c] === this.data[r + 1][c]) {
						return false;
					}
				}
			}
		}

		this.state = GameState.NOT_RUNNING;

		return true;
	},

	moveLeft: function () {
		for (let r = 0; r < 5; r++) {
			this.moveLeftInRow(r);
		}

		this.dataView();
	},

	moveLeftInRow: function (r) {
		for (let c = 0; c < 4; c++) {
			let nextc = this.leftGetNextInRow(r, c);

			if (nextc !== -1) {
				let activeCell = document.getElementById('v' + r + nextc),
					coordinateCell = document.getElementById('c' + r + c);

				if (this.data[r][c] === 0) {
					this.data[r][c] = this.data[r][nextc];
					this.data[r][nextc] = 0;

					this.steps.push({
						'remove': false,
						'activeCell': activeCell,
						'coordinateCell': coordinateCell,
					});

					c--;
				} else if (this.data[r][c] === this.data[r][nextc]) {
					this.data[r][c] *= 2;

					this.data[r][nextc] = 0;
					this.score += this.data[r][c];

					this.steps.push({
						'remove': true,
						'activeCell': activeCell,
						'coordinateCell': coordinateCell,
						'number': this.data[r][c],
					});
				}
			} else {
				break;
			}
		}
	},

	leftGetNextInRow: function (r, c) {
		for (let i = c + 1; i < 5; i++) {
			if (this.data[r][i] !== 0) {
				return i;
			}
		}
		return -1;
	},

	moveRight: function () {
		for (let r = 0; r < 5; r++) {
			this.moveRightInRow(r);
		}

		this.dataView();
	},

	moveRightInRow: function (r) {
		for (let c = 4; c > 0; c--) {
			let nextc = this.rightGetNextInRow(r, c);

			if (nextc !== -1) {
				let activeCell = document.getElementById('v' + r + nextc),
					coordinateCell = document.getElementById('c' + r + c);

				if (this.data[r][c] === 0) {
					this.data[r][c] = this.data[r][nextc];
					this.data[r][nextc] = 0;

					this.steps.push({
						'remove': false,
						'activeCell': activeCell,
						'coordinateCell': coordinateCell,
					});

					c++;
				} else if (this.data[r][c] === this.data[r][nextc]) {
					this.data[r][c] *= 2;
					this.data[r][nextc] = 0;
					this.score += this.data[r][c];

					this.steps.push({
						'remove': true,
						'activeCell': activeCell,
						'coordinateCell': coordinateCell,
						'number': this.data[r][c],
					});
				}
			} else {
				break;
			}
		}
	},

	rightGetNextInRow: function (r, c) {
		for (let i = c - 1; i >= 0; i--) {
			if (this.data[r][i] !== 0) {
				return i;
			}
		}
		return -1;
	},

	moveTop: function () {
		for (let c = 0; c < 5; c++) {
			this.moveTopInRow(c);
		}

		this.dataView();
	},

	moveTopInRow: function (c) {
		for (let r = 0; r < 4; r++) {
			let nextr = this.topGetNextInRow(c, r);

			if (nextr !== -1) {
				let activeCell = document.getElementById('v' + nextr + c),
					coordinateCell = document.getElementById('c' + r + c);

				if (this.data[r][c] === 0) {
					this.data[r][c] = this.data[nextr][c];
					this.data[nextr][c] = 0;

					this.steps.push({
						'remove': false,
						'activeCell': activeCell,
						'coordinateCell': coordinateCell,
					});

					r--;
				} else if (this.data[r][c] === this.data[nextr][c]) {
					this.data[r][c] *= 2;
					this.data[nextr][c] = 0;
					this.score += this.data[r][c];

					this.steps.push({
						'remove': true,
						'activeCell': activeCell,
						'coordinateCell': coordinateCell,
						'number': this.data[r][c],
					});
				}
			} else {
				break;
			}
		}
	},

	topGetNextInRow: function (c, r) {
		for (let i = r + 1; i < 5; i++) {
			if (this.data[i][c] !== 0) {
				return i;
			}
		}
		return -1;
	},

	moveBottom: function () {
		for (let c = 0; c < 5; c++) {
			this.moveBottomInRow(c);
		}

		this.dataView();
	},

	moveBottomInRow: function (c) {
		for (let r = 4; r > 0; r--) {
			let nextr = this.bottomGetNextInRow(c, r);

			if (nextr !== -1) {
				let activeCell = document.getElementById('v' + nextr + c),
					coordinateCell = document.getElementById('c' + r + c);

				if (this.data[r][c] === 0) {
					this.data[r][c] = this.data[nextr][c];
					this.data[nextr][c] = 0;

					this.steps.push({
						'remove': false,
						'activeCell': activeCell,
						'coordinateCell': coordinateCell,
					});
					r++;
				} else if (this.data[r][c] === this.data[nextr][c]) {
					this.data[r][c] *= 2;
					this.data[nextr][c] = 0;
					this.score += this.data[r][c];

					this.steps.push({
						'remove': true,
						'activeCell': activeCell,
						'coordinateCell': coordinateCell,
						'number': this.data[r][c],
					});
				}
			} else {
				break;
			}
		}
	},

	bottomGetNextInRow: function (c, r) {
		for (let i = r - 1; i >= 0; i--) {
			if (this.data[i][c] !== 0) {
				return i;
			}
		}
		return -1;
	},

	animate: function () {
		const random = {
			'executed': false,
		}

		for (const step of this.steps) {
			
			if (step.remove) {
				step.activeCell.addEventListener("transitionend", this.transitionendX2.bind(this, step.activeCell, 'v' + step.coordinateCell.id.slice(1), step.number, random));
			} else {
				step.activeCell.addEventListener("transitionend", this.transitionend.bind(this, step.activeCell, random));
			}
		}

		for (const step of this.steps) {
			if (step.remove) {
				step.activeCell.style.left = step.coordinateCell.offsetLeft + 'px';
				step.activeCell.style.top = step.coordinateCell.offsetTop + 'px';

			} else {
				step.activeCell.style.left = step.coordinateCell.offsetLeft + 'px';
				step.activeCell.style.top = step.coordinateCell.offsetTop + 'px';

				step.activeCell.id = 'v' + step.coordinateCell.id.slice(1);
			}
		}

		this.steps = [];
	},

	transitionend: function (activeCell, random) {
		activeCell.removeEventListener('transitionend', this.transitionend);
		this.randomNumWrapper(random);
	},


	transitionendX2: function (activeCell, goalCellId, number, random) {
		const goalCell = document.getElementById(goalCellId);
		goalCell.className = 'active-cell cell swoop  n' + number;
		deleteClass();
		goalCell.innerHTML = number;
		activeCell.remove();
		this.randomNumWrapper(random);
	},

	randomNumWrapper: function (random) {
		const activeCells = document.querySelectorAll('.active-cell');

		if (activeCells.length !== 25 && !random.executed) {
			this.randomNum();
			random.executed = true;
		}
	},
}

game.start();

document.onkeydown = debounce(function (event) {
	if (game.state === GameState.RUNNING) {
		switch (event.code) {
			case 'ArrowLeft':
				game.moveLeft();
				break;
			case 'ArrowUp':
				game.moveTop();
				break;
			case 'ArrowRight':
				game.moveRight();
				break;
			case 'ArrowDown':
				game.moveBottom();
				break;
		}

		accessMove = false;
	}
}, 300);


let startX, startY, endX, endY;

document.querySelector(".container").addEventListener("touchstart", function (event) {
	event = event || arguments[0];
	startX = event.touches[0].pageX;
	startY = event.touches[0].pageY;
})

document.querySelector(".container").addEventListener("touchend", debounce(function (event) {
	if (game.state === GameState.RUNNING) {
		event = event || e || arguments[0];
		endX = event.changedTouches[0].pageX;
		endY = event.changedTouches[0].pageY;

		let x = endX - startX;
		let y = endY - startY;

		let absX = Math.abs(x) > Math.abs(y);
		let absY = Math.abs(y) > Math.abs(x);
		if (x > 0 && absX) {
			game.moveRight();
		} else if (x < 0 && absX) {
			game.moveLeft();
		} else if (y > 0 && absY) {
			game.moveBottom();
		} else if (y < 0 && absY) {
			game.moveTop();
		}
	}
}, 300));


let sX, sY, eX, eY;
document.querySelector(".container").addEventListener('mousedown', function (e) {
	e.preventDefault();
	sX = e.clientX;
	sY = e.clientY;
})

document.querySelector(".container").addEventListener('mouseup', debounce(function (e) {
	e.preventDefault();

	if (game.state === GameState.RUNNING) {
		eX = e.clientX;
		eY = e.clientY;

		let x = eX - sX;
		let y = eY - sY;

		let abs_X = Math.abs(x) > Math.abs(y);
		let abs_Y = Math.abs(y) > Math.abs(x);
		if (x > 0 && abs_X) {
			game.moveRight();
		} else if (x < 0 && abs_X) {
			game.moveLeft();
		} else if (y > 0 && abs_Y) {
			game.moveBottom();
		} else if (y < 0 && abs_Y) {
			game.moveTop();
		}
	}
}, 300));


let calculatePosition = throttle(function () {
	let activeCells = document.querySelectorAll('.active-cell');

	for (let activeCell of activeCells) {
		let r = activeCell.id[1];
		let c = activeCell.id[2];

		let coordinateCell = document.getElementById('c' + r + c);

		activeCell.style.left = coordinateCell.offsetLeft + 'px';
		activeCell.style.top = coordinateCell.offsetTop + 'px';
	}
}, 300);

new ResizeObserver(calculatePosition).observe(document.getElementById('game-container'));

let deleteClass = throttle(function () {
	let activeCells = document.querySelectorAll('.active-cell');

	for (let activeCell of activeCells) {
		activeCell.classList.remove('swoop');
	}
}, 300);

function throttle(func, ms) {
	let timeoutId;

	return function () {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		timeoutId = setTimeout(func, ms);

	}
}

function debounce(f, ms) {
	let isCooldown = false;

	return function () {
		if (isCooldown) return;

		f.apply(this, arguments);

		isCooldown = true;

		setTimeout(() => isCooldown = false, ms);
	};
}







