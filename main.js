const GameState = {
	NOT_RUNNING: 0,
	RUNNING: 1,
};

let game = {
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

		 activeCell.classList.add('active-cell', 'cell', 'n' + this.data[this.gR][this.gC]);
		 activeCell.id = 'v' + this.gR + this.gC;
		 activeCell.innerHTML = this.data[this.gR][this.gC];

		 activeCell.style.left = currentCell.offsetLeft + 'px';
		 activeCell.style.top = currentCell.offsetTop + 'px';

		 game.container.appendChild(activeCell);
	},

	dataView: function () {
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

		 if (game.isGameOver()) {
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

		 game.state = GameState.NOT_RUNNING;

		 return true;
	},

	moveLeft: function () {
		 let random = {}

		 random.executed = false;

		 for (let r = 0; r < 5; r++) {
			  this.moveLeftInRow(r, random);
		 }

		 this.dataView();
	},

	moveLeftInRow: function (r, random) {
		 for (let c = 0; c < 4; c++) {
			  let nextc = this.leftGetNextInRow(r, c);

			  if (nextc !== -1) {
					let activeCell = document.getElementById('v' + r + nextc),
						 goalCell = document.getElementById('v' + r + c),
						 coordinateCell = document.getElementById('c' + r + c);

					if (this.data[r][c] === 0) {
						 this.data[r][c] = this.data[r][nextc];
						 this.data[r][nextc] = 0;

						 activeCell.addEventListener("transitionend", this.transitionend.bind(this, activeCell, random));

						 activeCell.style.left = coordinateCell.offsetLeft + 'px';
						 activeCell.style.top = coordinateCell.offsetTop + 'px';

						 activeCell.id = 'v' + r + c;

						 c--;
					} else if (this.data[r][c] === this.data[r][nextc]) {
						 this.data[r][c] *= 2;

						 this.data[r][nextc] = 0;
						 this.score += this.data[r][c];

						 activeCell.addEventListener("transitionend", this.transitionendX2.bind(this, activeCell, goalCell, this.data[r][c], random));

						 activeCell.style.left = coordinateCell.offsetLeft + 'px';
						 activeCell.style.top = coordinateCell.offsetTop + 'px';
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
		 let random = {}
		 random.executed = false;

		 for (let r = 0; r < 5; r++) {
			  this.moveRightInRow(r, random);
		 }

		 this.dataView();
	},

	moveRightInRow: function (r, random) {
		 for (let c = 4; c > 0; c--) {
			  let nextc = this.rightGetNextInRow(r, c);

			  if (nextc !== -1) {
					let activeCell = document.getElementById('v' + r + nextc),
						 goalCell = document.getElementById('v' + r + c),
						 coordinateCell = document.getElementById('c' + r + c);

					if (this.data[r][c] === 0) {
						 this.data[r][c] = this.data[r][nextc];
						 this.data[r][nextc] = 0;

						 activeCell.addEventListener("transitionend", this.transitionend.bind(this, activeCell, random));

						 activeCell.style.left = coordinateCell.offsetLeft + 'px';
						 activeCell.style.top = coordinateCell.offsetTop + 'px';

						 activeCell.id = 'v' + r + c;

						 c++;
					} else if (this.data[r][c] === this.data[r][nextc]) {
						 this.data[r][c] *= 2;
						 this.data[r][nextc] = 0;
						 this.score += this.data[r][c];

						 activeCell.addEventListener("transitionend", this.transitionendX2.bind(this, activeCell, goalCell, this.data[r][c], random));

						 activeCell.style.left = coordinateCell.offsetLeft + 'px';
						 activeCell.style.top = coordinateCell.offsetTop + 'px';
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
		 let random = {}
		 random.executed = false;

		 for (let c = 0; c < 5; c++) {
			  this.moveTopInRow(c, random);
		 }

		 this.dataView();
	},

	moveTopInRow: function (c, random) {
		 for (let r = 0; r < 4; r++) {
			  let nextr = this.topGetNextInRow(c, r);

			  if (nextr !== -1) {
					let activeCell = document.getElementById('v' + nextr + c),
						 goalCell = document.getElementById('v' + r + c),
						 coordinateCell = document.getElementById('c' + r + c);

					if (this.data[r][c] === 0) {
						 this.data[r][c] = this.data[nextr][c];
						 this.data[nextr][c] = 0;

						 activeCell.addEventListener("transitionend", this.transitionend.bind(this, activeCell, random));

						 activeCell.style.left = coordinateCell.offsetLeft + 'px';
						 activeCell.style.top = coordinateCell.offsetTop + 'px';

						 activeCell.id = 'v' + r + c;

						 r--;
					} else if (this.data[r][c] === this.data[nextr][c]) {
						 this.data[r][c] *= 2;
						 this.data[nextr][c] = 0;
						 this.score += this.data[r][c];

						 activeCell.addEventListener("transitionend", this.transitionendX2.bind(this, activeCell, goalCell, this.data[r][c], random));

						 activeCell.style.left = coordinateCell.offsetLeft + 'px';
						 activeCell.style.top = coordinateCell.offsetTop + 'px';
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
		 let random = {}
		 random.executed = false;

		 for (let c = 0; c < 5; c++) {
			  this.moveBottomInRow(c, random);
		 }

		 this.dataView();
	},

	moveBottomInRow: function (c, random) {
		 for (let r = 4; r > 0; r--) {
			  let nextr = this.bottomGetNextInRow(c, r);

			  if (nextr !== -1) {
					let activeCell = document.getElementById('v' + nextr + c),
						 goalCell = document.getElementById('v' + r + c),
						 coordinateCell = document.getElementById('c' + r + c);

					if (this.data[r][c] === 0) {
						 this.data[r][c] = this.data[nextr][c];
						 this.data[nextr][c] = 0;

						 activeCell.addEventListener("transitionend", this.transitionend.bind(this, activeCell, random));

						 activeCell.style.left = coordinateCell.offsetLeft + 'px';
						 activeCell.style.top = coordinateCell.offsetTop + 'px';

						 activeCell.id = 'v' + r + c;

						 r++;
					} else if (this.data[r][c] === this.data[nextr][c]) {
						 this.data[r][c] *= 2;
						 this.data[nextr][c] = 0;
						 this.score += this.data[r][c];

						 activeCell.addEventListener("transitionend", this.transitionendX2.bind(this, activeCell, goalCell, this.data[r][c], random));

						 activeCell.style.left = coordinateCell.offsetLeft + 'px';
						 activeCell.style.top = coordinateCell.offsetTop + 'px';
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

	transitionend: (activeCell, random) => {
		 activeCell.removeEventListener('transitionend', this.transitionend);
		 game.randomNumWrapper(random);
	},

	transitionendX2: (activeCell, goalCell, number, random) => {
		 goalCell.className = 'cell active-cell n' + number;
		 goalCell.innerHTML = number;
		 activeCell.remove();
		 game.randomNumWrapper(random);
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
}, 300),);

function debounce (f, ms) {
	let isCooldown = false;

	return function () {
		 if (isCooldown) return;

		 f.apply(this, arguments);

		 isCooldown = true;

		 setTimeout(() => isCooldown = false, ms);
	};
}







