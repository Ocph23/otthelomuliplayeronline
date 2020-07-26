function Othello(param) {
	var othello = this;
	othello.ai = new AI(othello);
	othello.board = new Chessboard();

	var map = [];
	var history = [];
	var aiRuning = false;

	var zobrist = new Zobrist();

	othello.aiSide = 0;

	othello.getHistory = function() {
		return history;
	};

	othello.play = function() {
		if (aiRuning) return;
		console.clear();

		map = [];
		for (var i = 0; i < 64; i++) map[i] = 0;
		map[28] = map[35] = 1;
		map[27] = map[36] = -1;
		map.black = map.white = 2;
		map.space = 60;
		map.frontier = [];
		var tk = [ 18, 19, 20, 21, 26, 29, 34, 37, 42, 43, 44, 45 ];
		for (var i = 0; i < 12; i++) map.frontier[tk[i]] = true;
		map.side = 1;
		map.newPos = -1;
		map.newRev = [];
		map.nextIndex = [];
		map.next = {};
		map.nextNum = 0;
		map.prevNum = 0;
		map.key = [ 0, 0 ];
		history = [];
		update();
		othello.ai.printMap(map);
	};

	function update() {
		//
		var aiAuto = othello.aiSide == map.side || othello.aiSide == 2;
		othello.findLocation(map);
		othello.board.update(map, !aiAuto);
		history.push(map);
		// console.log(map.nextIndex)

		if (map.space == 0 || (map.nextNum == 0 && map.prevNum == 0)) {
			setTimeout(gameOver, 300);
			return;
		}
		if (map.nextNum == 0) {
			othello.pass(map);
			setTimeout(update, 300);
			return;
		}
		if (aiAuto) {
			aiRuning = true;
			param.mePlay(false);
			setTimeout(aiRun, 300);
		} else {
			param.mePlay(true);
		}
	}

	function aiRun() {
		console.log('AI RUNING');
		var n = null;
		if (map.nextNum == 1) {
			n = map.nextIndex[0];
		} else if (map.space <= 60) {
			//	console.clear();
			n = othello.ai.startSearch(map);
			if (n == undefined) {
				n = map.nextIndex[(Math.random() * map.nextIndex.length) >> 0];
			}
		} else {
			n = map.nextIndex[(Math.random() * map.nextIndex.length) >> 0];
		}

		//oo.go(n);
		console.log('Computer Play :');
		othello.go(n);
	}

	function gameOver() {
		var playerSide1 = document.getElementById('playerSide1');
		var playerSide2 = document.getElementById('playerSide2');

		alert(
			'Selesai !\n  ' +
				playerSide1.innerHTML +
				' : ' +
				map.black +
				'\n' +
				playerSide2.innerHTML +
				' : ' +
				map.white +
				' \n' +
				(map.black == map.white
					? 'Draw!'
					: map.black > map.white ? playerSide1.innerHTML + ' Menang!' : playerSide2.innerHTML + ' Menang!')
		);
	}

	othello.dire = (function() {
		var dr = [ -8, -7, 1, 9, 8, 7, -1, -9 ];
		var bk = [ 8, 0, 0, 0, 8, 7, 7, 7 ];
		return function(i, d) {
			i += dr[d];
			return (i & 64) != 0 || (i & 7) == bk[d] ? 64 : i;
		};
	})();

	othello.findLocation = function(m) {
		function is(i, j) {
			var lk = 0;
			while ((i = othello.dire(i, j)) != 64 && m[i] == -m.side) {
				ta[la++] = i;
				lk++;
			}
			if (i == 64 || m[i] != m.side) la -= lk;
		}
		m.nextIndex = [];
		m.next = [];
		var hist = othello.ai.history[m.side == 1 ? 0 : 1][m.space];
		for (var i = 0; i < 60; i++) {
			var fi = hist[i];
			if (!m.frontier[fi]) continue;
			var ta = [],
				la = 0;
			for (var j = 0; j < 8; j++) is(fi, j);
			if (la > 0) {
				if (la != ta.length) ta = ta.slice(0, la);
				m.next[fi] = ta;
				m.nextIndex.push(fi);
			}
		}
		m.nextIndex.sort(function(a, b) {
			return a - b;
		});
		m.nextNum = m.nextIndex.length;
	};

	othello.findLocationX = function(m) {
		function is(i, j) {
			var lk = 0;
			while ((i = othello.dire(i, j)) != 64 && m[i] == m.side) {
				ta[la++] = i;
				lk++;
			}
			if (i == 64 || m[i] != -m.side) la -= lk;
		}
		m.nextIndex = [];
		m.next = [];
		var hist = othello.ai.history[m.side == 1 ? 0 : 1][m.space];
		for (var i = 0; i < 60; i++) {
			var fi = hist[i];
			if (!m.frontier[fi]) continue;
			var ta = [],
				la = 0;
			for (var j = 0; j < 8; j++) is(fi, j);
			if (la > 0) {
				if (la != ta.length) ta = ta.slice(0, la);
				m.next[fi] = ta;
				m.nextIndex.push(fi);
			}
		}
		m.nextIndex.sort(function(a, b) {
			return a - b;
		});
		m.nextNum = m.nextIndex.length;
	};

	othello.pass = function(m) {
		m.side = -m.side;
		m.prevNum = m.nextNum;
		zobrist.swap(m.key);
	};

	othello.newMap = function(m, n) {
		var nm = m.slice(0);
		nm[n] = m.side;

		nm.key = m.key.slice(0);
		zobrist.set(nm.key, m.side == 1 ? 0 : 1, n);

		nm.frontier = m.frontier.slice(0);
		nm.frontier[n] = false;
		for (var i = 0; i < 8; i++) {
			var k = othello.dire(n, i);
			if (k != 64 && nm[k] == 0) nm.frontier[k] = true;
		}

		var ne = m.next[n];
		var l = ne.length;
		for (var i = 0; i < l; i++) {
			nm[ne[i]] = m.side;
			zobrist.set(nm.key, 2, ne[i]);
		}
		if (m.side == 1) {
			nm.black = m.black + l + 1;
			nm.white = m.white - l;
		} else {
			nm.white = m.white + l + 1;
			nm.black = m.black - l;
		}
		nm.space = 64 - nm.black - nm.white;
		nm.side = -m.side;
		nm.prevNum = m.nextNum;
		zobrist.swap(nm.key);
		return nm;
	};

	othello.goChess = function(n) {
		//history.push(map);
		//othello.connection.invoke('Play', n);
		console.log('Player Play :');
		othello.go(n);
		if (othello.timer);
		clearInterval(othello.timer);
	};

	var aTime = 1000;
	othello.go = function(n) {
		aiRuning = false;
		var rev = map.next[n];
		map = othello.newMap(map, n);
		map.newRev = rev;
		map.newPos = n;
		//history.push(map);
		// console.log(map.key);
		update();
		othello.ai.printMap(map);
		/*setTimeout(() => {
			othello.mePlay = !othello.mePlay;
			param.mePlay(othello.mePlay);
		}, 200);*/
	};

	othello.AiGo = function() {
		console.clear();
		aiRun();
	};

	othello.historyBack = function() {
		if (aiRuning || history.length == 0) return;
		map = history.pop();
		update();
	};

	othello.timer = null;

	othello.board.toDown = othello.goChess;
}

function Zobrist() {
	var zobrist = this;

	var swapSide = [ rnd(), rnd() ];
	var zarr = [ [], [], [] ];
	for (var pn = 0; pn < 64; pn++) {
		zarr[0][pn] = [ rnd(), rnd() ];
		zarr[1][pn] = [ rnd(), rnd() ];
		zarr[2][pn] = [ zarr[0][pn][0] ^ zarr[1][pn][0], zarr[0][pn][1] ^ zarr[1][pn][1] ];
	}

	function rnd() {
		return (Math.random() * 0x100000000) >> 0;
	}

	zobrist.swap = function(key) {
		key[0] ^= swapSide[0];
		key[1] ^= swapSide[1];
	};

	zobrist.set = function(key, pc, pn) {
		key[0] ^= zarr[pc][pn][0];
		key[1] ^= zarr[pc][pn][1];
	};
}

function OthelloOnline(signalConnection, mePlayEvent) {
	var othello = this;
	othello.ai = new AI(othello);
	othello.board = new Chessboard();

	var map = [];
	var history = [];
	var aiRuning = false;

	var zobrist = new Zobrist();

	othello.aiSide = 0;
	othello.getHistory = function() {
		return history;
	};
	othello.play = function() {
		if (aiRuning) return;
		map = [];
		for (var i = 0; i < 64; i++) map[i] = 0;
		map[28] = map[35] = 1;
		map[27] = map[36] = -1;
		map.black = map.white = 2;
		map.space = 60;
		map.frontier = [];
		var tk = [ 18, 19, 20, 21, 26, 29, 34, 37, 42, 43, 44, 45 ];
		for (var i = 0; i < 12; i++) map.frontier[tk[i]] = true;
		map.side = 1;
		map.newPos = -1;
		map.newRev = [];
		map.nextIndex = [];
		map.next = {};
		map.nextNum = 0;
		map.prevNum = 0;
		map.key = [ 0, 0 ];
		history = [];
		update();
	};

	function update() {
		//var aiAuto = othello.aiSide == map.side || othello.aiSide == 2;
		othello.findLocation(map);
		othello.board.update(map, othello.mePlay);
		othello.game.owner.point = map.black;
		othello.game.opponent.point = map.white;
		history.push(map);
		if (map.space == 0 || (map.nextNum == 0 && map.prevNum == 0)) {
			setTimeout(gameOver, 300);
			return;
		}
		if (map.nextNum == 0) {
			othello.pass(map);
			setTimeout(update, 300);
			return;
		}
		othello.connection.invoke(
			'UpdateGame',
			othello.game.gameId,
			othello.game.owner.point,
			othello.game.opponent.point
		);
	}

	function aiRun() {
		var n = 0;
		if (map.nextNum == 1) {
			n = map.nextIndex[0];
		} else if (map.space <= 58) {
			n = othello.ai.startSearch(map);
		} else {
			n = map.nextIndex[(Math.random() * map.nextIndex.length) >> 0];
		}

		othello.goChess(n);
	}

	function gameOver() {
		othello.connection.invoke('GameOver', othello.game);
		var playerSide1 = document.getElementById('playerSide1');
		var playerSide2 = document.getElementById('playerSide2');

		alert(
			'Selesai !\n  ' +
				playerSide1.innerHTML +
				' : ' +
				map.black +
				'\n' +
				playerSide2.innerHTML +
				' : ' +
				map.white +
				' \n' +
				(map.black == map.white
					? 'Draw!'
					: map.black > map.white ? playerSide1.innerHTML + ' Menang!' : playerSide2.innerHTML + ' Menang!')
		);
	}

	othello.dire = (function() {
		var dr = [ -8, -7, 1, 9, 8, 7, -1, -9 ];
		var bk = [ 8, 0, 0, 0, 8, 7, 7, 7 ];
		return function(i, d) {
			i += dr[d];
			return (i & 64) != 0 || (i & 7) == bk[d] ? 64 : i;
		};
	})();

	othello.findLocation = function(m) {
		function is(i, j) {
			var lk = 0;
			while ((i = othello.dire(i, j)) != 64 && m[i] == -m.side) {
				ta[la++] = i;
				lk++;
			}
			if (i == 64 || m[i] != m.side) la -= lk;
		}
		m.nextIndex = [];
		m.next = [];
		var hist = othello.ai.history[m.side == 1 ? 0 : 1][m.space];
		for (var i = 0; i < 60; i++) {
			var fi = hist[i];
			if (!m.frontier[fi]) continue;
			var ta = [],
				la = 0;
			for (var j = 0; j < 8; j++) is(fi, j);
			if (la > 0) {
				if (la != ta.length) ta = ta.slice(0, la);
				m.next[fi] = ta;
				m.nextIndex.push(fi);
			}
		}

		m.nextNum = m.nextIndex.length;
	};

	othello.pass = function(m) {
		m.side = -m.side;
		m.prevNum = m.nextNum;
		zobrist.swap(m.key);
	};

	othello.newMap = function(m, n) {
		var nm = m.slice(0);
		nm[n] = m.side;

		nm.key = m.key.slice(0);
		zobrist.set(nm.key, m.side == 1 ? 0 : 1, n);

		nm.frontier = m.frontier.slice(0);
		nm.frontier[n] = false;
		for (var i = 0; i < 8; i++) {
			var k = othello.dire(n, i);
			if (k != 64 && nm[k] == 0) nm.frontier[k] = true;
		}

		var ne = m.next[n];
		var l = ne.length;
		for (var i = 0; i < l; i++) {
			nm[ne[i]] = m.side;
			zobrist.set(nm.key, 2, ne[i]);
		}
		if (m.side == 1) {
			nm.black = m.black + l + 1;
			nm.white = m.white - l;
		} else {
			nm.white = m.white + l + 1;
			nm.black = m.black - l;
		}
		nm.space = 64 - nm.black - nm.white;
		nm.side = -m.side;
		nm.prevNum = m.nextNum;
		zobrist.swap(nm.key);
		return nm;
	};

	othello.goChess = function(n) {
		//history.push(map);
		othello.connection.invoke('Play', othello.game.gameId, n);
		othello.mePlay = false;
		othello.go(n);
		if (othello.timer);
		clearInterval(othello.timer);
	};

	othello.go = function(n) {
		aiRuning = false;
		var rev = map.next[n];
		map = othello.newMap(map, n);
		map.newRev = rev;
		map.newPos = n;
		update();
		setTimeout(() => {
			othello.mePlay = !othello.mePlay;
			mePlayEvent(othello.mePlay);
		}, 200);
	};

	othello.AiGo = function() {
		aiRun();
	};

	othello.historyBack = function() {
		if (aiRuning || history.length == 0) return;
		map = history.pop();
		update();
	};

	othello.timer = null;
	othello.timerStart = function() {
		othello.counterTime = 60;
		othello.timer = setInterval(timeCounter, 1000);
	};
	function timeCounter() {
		if (othello.counterTime == 0) {
			clearInterval(othello.timer);
			othello.counterTime = 0;
			othello.connection.invoke('Resign');
		}
		var t = document.getElementById('time');
		t.innerHTML = othello.counterTime--;
	}

	othello.connection = signalConnection;

	othello.board.toDown = othello.goChess;
}

function OthelloView(param) {
	var othello = this;
	othello.ai = new AI(othello);
	othello.board = new Chessboard();

	var map = [];
	var history = [];
	var aiRuning = false;

	var zobrist = new Zobrist();

	othello.aiSide = 0;

	othello.getHistory = function() {
		return history;
	};

	othello.play = function() {
		if (aiRuning) return;
		console.clear();

		map = [];
		for (var i = 0; i < 64; i++) map[i] = 0;
		map[28] = map[35] = 1;
		map[27] = map[36] = -1;
		map.black = map.white = 2;
		map.space = 60;
		map.frontier = [];
		var tk = [ 18, 19, 20, 21, 26, 29, 34, 37, 42, 43, 44, 45 ];
		for (var i = 0; i < 12; i++) map.frontier[tk[i]] = true;
		map.side = 1;
		map.newPos = -1;
		map.newRev = [];
		map.nextIndex = [];
		map.next = {};
		map.nextNum = 0;
		map.prevNum = 0;
		map.key = [ 0, 0 ];
		history = [];
		othello.findLocation(map);
		history.push(map);
		//othello.ai.printMap(map);
	};

	function update() {
		//
		var aiAuto = othello.aiSide == map.side || othello.aiSide == 2;
		othello.findLocation(map);
		history.push(map);
		if (map.space == 0 || (map.nextNum == 0 && map.prevNum == 0)) {
			setTimeout(gameOver, 300);
			return;
		}
		if (map.nextNum == 0) {
			othello.pass(map);
			setTimeout(update, 300);
			return;
		}
	}

	function gameOver() {
		var playerSide1 = document.getElementById('playerSide1');
		var playerSide2 = document.getElementById('playerSide2');

		alert(
			'Selesai !\n  ' +
				playerSide1.innerHTML +
				' : ' +
				map.black +
				'\n' +
				playerSide2.innerHTML +
				' : ' +
				map.white +
				' \n' +
				(map.black == map.white
					? 'Draw!'
					: map.black > map.white ? playerSide1.innerHTML + ' Menang!' : playerSide2.innerHTML + ' Menang!')
		);
	}

	othello.dire = (function() {
		var dr = [ -8, -7, 1, 9, 8, 7, -1, -9 ];
		var bk = [ 8, 0, 0, 0, 8, 7, 7, 7 ];
		return function(i, d) {
			i += dr[d];
			return (i & 64) != 0 || (i & 7) == bk[d] ? 64 : i;
		};
	})();

	othello.findLocation = function(m) {
		function is(i, j) {
			var lk = 0;
			while ((i = othello.dire(i, j)) != 64 && m[i] == -m.side) {
				ta[la++] = i;
				lk++;
			}
			if (i == 64 || m[i] != m.side) la -= lk;
		}
		m.nextIndex = [];
		m.next = [];
		var hist = othello.ai.history[m.side == 1 ? 0 : 1][m.space];
		for (var i = 0; i < 60; i++) {
			var fi = hist[i];
			if (!m.frontier[fi]) continue;
			var ta = [],
				la = 0;
			for (var j = 0; j < 8; j++) is(fi, j);
			if (la > 0) {
				if (la != ta.length) ta = ta.slice(0, la);
				m.next[fi] = ta;
				m.nextIndex.push(fi);
			}
		}
		m.nextIndex.sort(function(a, b) {
			return a - b;
		});
		m.nextNum = m.nextIndex.length;
	};

	othello.pass = function(m) {
		m.side = -m.side;
		m.prevNum = m.nextNum;
		zobrist.swap(m.key);
	};

	othello.newMap = function(m, n) {
		var nm = m.slice(0);
		nm[n] = m.side;

		nm.key = m.key.slice(0);
		zobrist.set(nm.key, m.side == 1 ? 0 : 1, n);

		nm.frontier = m.frontier.slice(0);
		nm.frontier[n] = false;
		for (var i = 0; i < 8; i++) {
			var k = othello.dire(n, i);
			if (k != 64 && nm[k] == 0) nm.frontier[k] = true;
		}

		var ne = m.next[n];
		var l = ne.length;
		for (var i = 0; i < l; i++) {
			nm[ne[i]] = m.side;
			zobrist.set(nm.key, 2, ne[i]);
		}
		if (m.side == 1) {
			nm.black = m.black + l + 1;
			nm.white = m.white - l;
		} else {
			nm.white = m.white + l + 1;
			nm.black = m.black - l;
		}
		nm.space = 64 - nm.black - nm.white;
		nm.side = -m.side;
		nm.prevNum = m.nextNum;
		zobrist.swap(nm.key);
		return nm;
	};

	othello.goChess = function(n) {
		//history.push(map);
		//othello.connection.invoke('Play', n);
		console.log('Player Play :');
		othello.go(n);
		if (othello.timer);
		clearInterval(othello.timer);
	};

	othello.go = function(n) {
		aiRuning = false;
		var rev = map.next[n];
		if (map.space == 2) {
			var a = 3;
		}
		map = othello.newMap(map, n);
		map.newRev = rev;
		map.newPos = n;

		othello.findLocation(map);
		history.push(map);

		// console.log(map.key);
		//update();
		//othello.ai.printMap(map);
		/*setTimeout(() => {
			othello.mePlay = !othello.mePlay;
			param.mePlay(othello.mePlay);
		}, 200);*/
	};

	othello.historyBack = function() {
		if (aiRuning || history.length == 0) return;
		map = history.pop();
		update();
	};

	othello.board.toDown = othello.goChess;
}
