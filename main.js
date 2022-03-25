let game = {
	data: [],
	score: 0,
	record: 0,
	gameover: 0,
	gamewin: 0,
	gamerunning: 1,
	status: 1,
	startTime: 0,
	endTime: 0,
	Time: 0,
	timeStapsArr: [],
	start: function () {
		console.log(this.timeStapsArr);
		this.startTime = new Date();
		this.gamewin = 0;
		this.score = 0;
		this.status = this.gamerunning;
		this.mydata = [];



		for (let r = 0; r < 5; r++) {
			this.data[r] = [];

			for (let c = 0; c < 5; c++) {
				this.data[r][c] = 0;
			}
		}


		//console.log(this.data);
		this.randomNum();
		this.randomNum();

		this.dataView();
		//console.log(this.data);
	},

	randomNum: function () {
		for (; ;) {
			let r = Math.floor(Math.random() * 5);
			let c = Math.floor(Math.random() * 5);
			if (this.data[r][c] == 0) {
				var num = Math.random() > 0.1 ? 2 : 4;
				this.data[r][c] = num;
				break;
			}
		}
	},

	// навешивание классов, сменяющих стили блоков, передача обновленных данных
	dataView: function () {
		for (let r = 0; r < 5; r++) {
			for (let c = 0; c < 5; c++) {
				var div = document.getElementById('c' + r + c);
				if (this.data[r][c] == 0) {
					div.innerHTML = '';
					div.className = 'cell';
				} else {
					div.innerHTML = this.data[r][c];
					div.className = 'cell n' + this.data[r][c];
				}
			}
		}

		document.getElementById('score_1').innerHTML = this.score;

		if (this.isGameWin()) {
			this.secundomer();
			document.getElementById('score_3').innerHTML = this.score;

			if (this.score > this.record) {
				this.record = this.score;
				document.getElementById('record_1').innerHTML = this.record;
				document.getElementById('record_3').innerHTML = this.record;
			}
			//document.getElementById('gamewin').style.display = 'block';
			document.getElementById('gamewin').style.opacity = '0.7';
			document.getElementById('gamewin').style.pointerEvents = 'auto';

		}
		else {
			//document.getElementById('gamewin').style.display = 'none';
			document.getElementById('gamewin').style.opacity = '0';
			document.getElementById('gamewin').style.pointerEvents = 'none';
		}

		if (this.status == this.gameover) {
			document.getElementById('score_2').innerHTML = this.score;



			if (this.score > this.record) {
				this.record = this.score;
				document.getElementById('record_1').innerHTML = this.record;
				document.getElementById('record_2').innerHTML = this.record;
			}

			//document.getElementById('gameover').style.display = 'block';
			document.getElementById('gameover').style.opacity = '0.7';
			document.getElementById('gameover').style.pointerEvents = 'auto';
			//document.getElementById('over').style.opacity = '1';
		}
		else {
			//document.getElementById('gameover').style.display = 'none';
			document.getElementById('gameover').style.opacity = '0';
			document.getElementById('gameover').style.pointerEvents = 'none';
		}
	},

	secundomer: function () {
		this.Time = (this.endTime - this.startTime); // получаем количество милисекунд
		this.timeStapsArr.push(this.Time); // пушим в массив

		let h = Math.floor(this.Time / 3600000); // преобразуем время прошедшей попытки в нужный формат 
		this.Time -= h * 3600000;

		let m = Math.floor(this.Time / 60000);
		this.Time -= m * 60000;

		let s = Math.floor(this.Time / 1000);
		this.Time -= s * 1000;

		let ms = this.Time;

		document.getElementById('winTime').innerHTML = `Время: <span>${h}ч:${m}м:${s}с:${ms}мс</span>`;

		// сортируем массив от меньшего количества миллисекунд к большему
		this.timeStapsArr.sort(function (a, b) {
			return a - b;
		});

		// чистим нашу таблицу
		document.querySelector('.table__body').innerHTML = "";

		// получаем нужный формат от каждого элемента массива и аписываем в таблицу
		this.timeStapsArr.forEach(element => {

			let h = Math.floor(element / 3600000);
			element -= h * 3600000;

			let m = Math.floor(element / 60000);
			element -= m * 60000;

			let s = Math.floor(element / 1000);
			element -= s * 1000;

			let ms = element;

			li = document.createElement('li');
			li.textContent = `${h}ч:${m}м:${s}с:${ms}мс`;

			document.querySelector('.table__body').appendChild(li);
		});
	},

	isGameWin: function () {
		for (var r = 0; r < 5; r++) {
			for (var c = 0; c < 5; c++) {
				if (this.data[r][c] == 2048) {
					this.gamewin = 1;
					this.endTime = new Date();
					return this.gamewin;
				}
			}
		}
	},

	isGameOver: function () {
		outer: for (var r = 0; r < 5; r++) {
			for (var c = 0; c < 5; c++) {
				if (this.data[r][c] == 0) {
					return false;
				}

				if (c < 4) {
					if (this.data[r][c] == this.data[r][c + 1]) {
						return false;
					}
				}

				if (r < 4) {
					if (this.data[r][c] == this.data[r + 1][c]) {
						return false;
					}
				}
			}
		}
		this.endTime = new Date();
		return true;
	},

	//перемещение влево
	moveLeft: function () {
		var before = String(this.data);
		//console.log(before);

		for (let r = 0; r < 5; r++) {
			this.moveLeftInRow(r);
		}

		var after = String(this.data);
		//console.log(after);

		if (before != after) {
			this.randomNum();
			if (this.isGameOver()) {
				this.status = this.gameover;
			}
			this.dataView();
		}
	},

	moveLeftInRow: function (r) {
		for (let c = 0; c < 4; c++) {
			var nextc = this.leftGetNextInRow(r, c);
			//console.log(nextc);
			if (nextc != -1) {
				if (this.data[r][c] == 0) {
					this.data[r][c] = this.data[r][nextc];
					this.data[r][nextc] = 0;
					c--;
				}
				else if (this.data[r][c] == this.data[r][nextc]) {
					this.data[r][c] *= 2;
					this.data[r][nextc] = 0;
					this.score += this.data[r][c];
				}
			}
			else {
				break;
			}
		}
	},

	leftGetNextInRow: function (r, c) {
		for (let i = c + 1; i < 5; i++) {
			if (this.data[r][i] != 0) {
				return i;
			}
		}
		return -1;
	},


	//перемещение впарво
	moveRight: function () {
		var before = String(this.data);

		for (let r = 0; r < 5; r++) {
			this.moveRightInRow(r);
		}

		var after = String(this.data);

		if (before != after) {
			this.randomNum();
			if (this.isGameOver()) {
				this.status = this.gameover;
			}
			this.dataView();
		}
	},

	moveRightInRow: function (r) {
		for (let c = 4; c > 0; c--) {
			var nextc = this.rightGetNextInRow(r, c);
			if (nextc != -1) {
				if (this.data[r][c] == 0) {
					this.data[r][c] = this.data[r][nextc];
					this.data[r][nextc] = 0;
					c++;
				}
				else if (this.data[r][c] == this.data[r][nextc]) {
					this.data[r][c] *= 2;
					this.data[r][nextc] = 0;
					this.score += this.data[r][c];
				}
			}
			else {
				break;
			}
		}
	},

	rightGetNextInRow: function (r, c) {
		for (let i = c - 1; i >= 0; i--) {
			if (this.data[r][i] != 0) {
				return i;
			}
		}
		return -1;
	},

	//перемещение вверх
	moveTop: function () {
		var before = String(this.data);

		for (var c = 0; c < 5; c++) {
			this.moveTopInRow(c);
		}

		var after = String(this.data);

		if (before != after) {
			this.randomNum();
			if (this.isGameOver()) {
				this.status = this.gameover;
			}
			this.dataView();
		}
	},

	moveTopInRow: function (c) {
		for (var r = 0; r < 4; r++) {
			var nextr = this.topGetNextInRow(c, r);

			if (nextr != -1) {
				if (this.data[r][c] == 0) {
					this.data[r][c] = this.data[nextr][c];
					this.data[nextr][c] = 0;
					r--;
				}
				else if (this.data[r][c] == this.data[nextr][c]) {
					this.data[r][c] *= 2;
					this.data[nextr][c] = 0;
					this.score += this.data[r][c];
				}
			}
			else {
				break;
			}
		}
	},

	topGetNextInRow: function (c, r) {
		for (var i = r + 1; i < 5; i++) {
			if (this.data[i][c] != 0) {
				return i;
			}
		}
		return -1;
	},

	//перемещение вниз
	moveBottom: function () {
		var before = String(this.data);

		for (var c = 0; c < 5; c++) {
			this.moveBottomInRow(c);
		}

		var after = String(this.data);

		if (before != after) {
			this.randomNum();
			if (this.isGameOver()) {
				this.status = this.gameover;
			}
			this.dataView();
		}
	},

	moveBottomInRow: function (c) {
		for (var r = 4; r > 0; r--) {
			var nextr = this.bottomGetNextInRow(c, r);
			if (nextr != -1) {
				if (this.data[r][c] == 0) {
					this.data[r][c] = this.data[nextr][c];
					this.data[nextr][c] = 0;
					r++;
				}
				else if (this.data[r][c] == this.data[nextr][c]) {
					this.data[r][c] *= 2;
					this.data[nextr][c] = 0;
					this.score += this.data[r][c];
				}
			}
			else {
				break;
			}
		}
	},

	bottomGetNextInRow: function (c, r) {
		for (var i = r - 1; i >= 0; i--) {
			if (this.data[i][c] != 0) {
				return i;
			}
		}
		return -1;
	}


}

game.start();


document.onkeydown = function (event) {
	var event = event;
	if (event.keyCode == 37) {
		if (game.isGameWin() != 1) {
			game.moveLeft();
		}
	}
	else if (event.keyCode == 38) {
		if (game.isGameWin() != 1) {
			game.moveTop();
		}
	}
	else if (event.keyCode == 39) {
		if (game.isGameWin() != 1) {
			game.moveRight();
		}
	}
	else if (event.keyCode == 40) {
		if (game.isGameWin() != 1) {
			game.moveBottom();
		}
	}
}


var startX, startY, endX, endY;    // Определение четырех переменных для хранения значений по оси X и оси Y при касании и при выходе из касания
document.querySelector(".container").addEventListener("touchstart", function (event) {  // Связывание события слушателя при начале касания пальцем
	var event = event || e || arguments[0];
	startX = event.touches[0].pageX;
	startY = event.touches[0].pageY;
})

document.querySelector(".container").addEventListener("touchend", function (event) {    // Привязка события прослушивания, когда палец касается и уходит
	var event = event || e || arguments[0];
	endX = event.changedTouches[0].pageX;
	endY = event.changedTouches[0].pageY;

	var x = endX - startX;
	var y = endY - startY;

	var absX = Math.abs(x) > Math.abs(y);
	var absY = Math.abs(y) > Math.abs(x);
	if (x > 0 && absX) {
		if (game.isGameWin() != 1) {
			game.moveRight();
		}
	}
	else if (x < 0 && absX) {
		if (game.isGameWin() != 1) {
			game.moveLeft();
		}
	}
	else if (y > 0 && absY) {
		if (game.isGameWin() != 1) {
			game.moveBottom();
		}
	}
	else if (y < 0 && absY) {
		if (game.isGameWin() != 1) {
			game.moveTop();
		}
	}

})


var sX, sY, eX, eY;
document.querySelector(".container").addEventListener('mousedown', function (e) {
	sX = e.clientX;
	sY = e.clientY;
	console.log(sX);
	console.log(sY);
})

document.querySelector(".container").addEventListener('mouseup', function (e) {
	eX = e.clientX;
	eY = e.clientY;
	console.log(eX);
	console.log(eY);
	var x = eX - sX;
	var y = eY - sY;

	var abs_X = Math.abs(x) > Math.abs(y);
	var abs_Y = Math.abs(y) > Math.abs(x);
	if (x > 0 && abs_X) {
		if (game.isGameWin() != 1) {
			game.moveRight();
		}
	}
	else if (x < 0 && abs_X) {
		if (game.isGameWin() != 1) {
			game.moveLeft();
		}
	}
	else if (y > 0 && abs_Y) {
		if (game.isGameWin() != 1) {
			game.moveBottom();
		}
	}
	else if (y < 0 && abs_Y) {
		if (game.isGameWin() != 1) {
			game.moveTop();
		}
	}
})







