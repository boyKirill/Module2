var game = {
	mydata: [],     // Добавляем атрибут mydata для хранения игровых данных
	score: 0,	  	   // Добавляем атрибут оценки
	gameover: 0,	    // Добавляем состояние в конце игры 
	gamerrunning: 1,	     // Добавляем состояние, когда игра запущена
	status: 1,		      // Добавляем состояние игры
	start: function () {      // Устанавливаем метод при запуске игры
		this.status = this.gamerrunning;
		this.score = 0;
		this.mydata = [];
		for (var r = 0; r < 4; r++) {  // Добавьте число 0 к переменной цикла массива mydata, чтобы сделать его двумерным массивом
			this.mydata[r] = [];
			for (var c = 0; c < 4; c++) {
				this.mydata[r][c] = 0;
			}
		}
		this.randomNum();    // Число 2/4 генерируется случайным образом в начале игры
		this.randomNum();
		this.dataView();     // Выполняем функцию dataView, когда игра начинает передавать обновление данных на страницу, обновляем данные на странице
		// console.log(this.mydata);
	},

	randomNum: function () {       // Метод генерации случайных чисел и присвоения начального случайного числа mydata
		for (; ;) {                     // Циклу for здесь нельзя задать фиксированное условие, потому что конечное условие не может быть известно, когда игра запущена, и он может работать только последовательно
			var r = Math.floor(Math.random() * 4);      // Задаем случайную величину и пусть это будет координата, в которой число появляется случайным образом
			var c = Math.floor(Math.random() * 4);
			if (this.mydata[r][c] == 0) {               // Если значение в текущей координате в данных равно 0 или пусто, вставляем случайное число 2 или 4
				var num = Math.random() > 0.5 ? 2 : 4;     // Установленное случайное число 2 или 4 имеет одинаковый шанс выпадения, наполовину открыто
				this.mydata[r][c] = num;
				break;
			}
		}
	},


	dataView: function () {      // Метод передачи данных на страницу и контроль смены стиля
		for (var r = 0; r < 4; r++) {
			for (var c = 0; c < 4; c++) {
				var div = document.getElementById("c" + r + c);
				if (this.mydata[r][c] == 0) {
					div.innerHTML = "";
					div.className = "cell";
				}
				else {
					div.innerHTML = this.mydata[r][c];
					div.className = 'cell n' + this.mydata[r][c];
				}
			}
		}
		document.getElementById('score01').innerHTML = this.score;
		if (this.status == this.gameover) {
			document.getElementById('score02').innerHTML = this.score;
			document.getElementById('gameover').style.display = 'block';
		}
		else {
			document.getElementById('gameover').style.display = 'none';
		}
	},

	isgameover: function () {
		for (var r = 0; r < 4; r++) {
			for (var c = 0; c < 4; c++) {
				if (this.mydata[r][c] == 0) {
					return false;
				}
				if (c < 3) {
					if (this.mydata[r][c] == this.mydata[r][c + 1]) {
						return false;
					}
				}
				if (r < 3) {
					if (this.mydata[r][c] == this.mydata[r + 1][c]) {
						return false;
					}
				}
			}
		}
		return true;
	},

	//Движение влево
	moveLeft: function () {
		var before = String(this.mydata);
		for (var r = 0; r < 4; r++) {
			this.moveLeftInRow(r);
		}
		var after = String(this.mydata);
		if (before != after) {
			this.randomNum();
			if (this.isgameover()) {
				this.status = this.gameover;
			}
			this.dataView();
		}
	},

	moveLeftInRow: function (r) {
		for (var c = 0; c < 3; c++) {
			var nextc = this.getNEXTinRow(r, c);
			if (nextc != -1) {
				if (this.mydata[r][c] == 0) {
					this.mydata[r][c] = this.mydata[r][nextc];
					this.mydata[r][nextc] = 0;
					c--;
				}
				else if (this.mydata[r][c] == this.mydata[r][nextc]) {
					this.mydata[r][c] *= 2;
					this.mydata[r][nextc] = 0;
					this.score += this.mydata[r][c];
				}
			}
			else {
				break;
			}
		}
	},

	getNEXTinRow: function (r, c) {
		for (var i = c + 1; i < 4; i++) {
			if (this.mydata[r][i] != 0) {
				return i;
			}
		}
		return -1;
	},


	//Переместить вправо
	moveRight: function () {
		var before = String(this.mydata);
		for (var r = 0; r < 4; r++) {
			this.moveRightInRow(r);
		}
		var after = String(this.mydata);
		if (before != after) {
			this.randomNum();
			if (this.isgameover()) {
				this.status = this.gameover;
			}
			this.dataView();
		}
	},

	moveRightInRow: function (r) {
		for (var c = 3; c > 0; c--) {
			var nextc = this.RightgetNEXTinRow(r, c);
			if (nextc != -1) {
				if (this.mydata[r][c] == 0) {
					this.mydata[r][c] = this.mydata[r][nextc];
					this.mydata[r][nextc] = 0;
					c++;
				}
				else if (this.mydata[r][c] == this.mydata[r][nextc]) {
					this.mydata[r][c] *= 2;
					this.mydata[r][nextc] = 0;
					this.score += this.mydata[r][c];
				}
			}
			else {
				break;
			}
		}
	},

	RightgetNEXTinRow: function (r, c) {
		for (var i = c - 1; i >= 0; i--) {
			if (this.mydata[r][i] != 0) {
				return i;
			}
		}
		return -1;
	},


	// Двигаться вверх
	moveTop: function () {
		var before = String(this.mydata);
		for (var r = 0; r < 4; r++) {
			this.moveTopInRow(r);
		}
		var after = String(this.mydata);
		if (before != after) {
			this.randomNum();
			if (this.isgameover()) {
				this.status = this.gameover;
			}
			this.dataView();
		}
	},

	moveTopInRow: function (r) {
		for (var c = 0; c < 3; c++) {
			var nextc = this.TopgetNEXTinRow(r, c);
			if (nextc != -1) {
				if (this.mydata[c][r] == 0) {
					this.mydata[c][r] = this.mydata[nextc][r];
					this.mydata[nextc][r] = 0;
					c++;
				}
				else if (this.mydata[c][r] == this.mydata[nextc][r]) {
					this.mydata[c][r] *= 2;
					this.mydata[nextc][r] = 0;
					this.score += this.mydata[c][r];
				}
			}
			else {
				break;
			}
		}
	},

	TopgetNEXTinRow: function (r, c) {
		for (var i = c + 1; i < 4; i++) {
			if (this.mydata[i][r] != 0) {
				return i;
			}
		}
		return -1;
	},


	// двигаться вниз
	moveBottom: function () {
		var before = String(this.mydata);
		for (var r = 0; r < 4; r++) {
			this.moveBottomInRow(r);
		}
		var after = String(this.mydata);
		if (before != after) {
			this.randomNum();
			if (this.isgameover()) {
				this.status = this.gameover;
			}
			this.dataView();
		}
	},

	moveBottomInRow: function (r) {
		for (var c = 3; c > 0; c--) {
			var nextc = this.BottomgetNEXTinRow(r, c);
			if (nextc != -1) {
				if (this.mydata[c][r] == 0) {
					this.mydata[c][r] = this.mydata[nextc][r];
					this.mydata[nextc][r] = 0;
					c++;
				}
				else if (this.mydata[c][r] == this.mydata[nextc][r]) {
					this.mydata[c][r] *= 2;
					this.mydata[nextc][r] = 0;
					this.score += this.mydata[c][r];
				}
			}
			else {
				break;
			}
		}
	},

	BottomgetNEXTinRow: function (r, c) {
		for (var i = c - 1; i >= 0; i--) {
			if (this.mydata[i][r] != 0) {
				return i;
			}
		}
		return -1;
	},

}
game.start();

document.onkeydown = function (event) {
	var event = event;
	if (event.keyCode == 37) {
		game.moveLeft();
	}
	else if (event.keyCode == 38) {
		game.moveTop();
	}
	else if (event.keyCode == 39) {
		game.moveRight();
	}
	else if (event.keyCode == 40) {
		game.moveBottom();
	}
}


