function AI(othe) {
	var oo = this;
	oo.calculateTime = 1000;
	oo.outcomeDepth = 14;
	var outcomeCoarse = 15;
	var maxDepth = 2;
	var outTime;
	let dataBoards = [ 8, 16, 24, 32, 40, 48, 56, 64 ];
	var weight = [ 6, 11, 2, 2, 3 ];
	var rnd = [
		{
			s: 0,
			a: 1,
			b: 8,
			c: 9,
			dr: [ 1, 8 ]
		},
		{
			s: 7,
			a: 6,
			b: 15,
			c: 14,
			dr: [ -1, 8 ]
		},
		{
			s: 56,
			a: 57,
			b: 48,
			c: 49,
			dr: [ 1, -8 ]
		},
		{
			s: 63,
			a: 62,
			b: 55,
			c: 54,
			dr: [ -1, -8 ]
		}
	];

	oo.printMap = function(m) {
		let last = 0;
		var row = '';
		var items = [];
		dataBoards.forEach((element) => {
			row += '|';
			m.slice(last, element).map((x) => {
				row += x == 0 ? '   |' : x == -1 ? ' O |' : ' X |';
			});
			row += '\r\n---------------------------------\r\n';
			last = element;
		});

		console.log(row);
	};

	oo.history = [ [], [] ];
	for (var i = 0; i < 2; i++)
		for (var j = 0; j <= 60; j++)
			oo.history[i][j] = [
				0,
				63,
				7,
				56,
				37,
				26,
				20,
				43,
				19,
				29,
				34,
				44,
				21,
				42,
				45,
				18,
				2,
				61,
				23,
				40,
				5,
				58,
				47,
				16,
				10,
				53,
				22,
				41,
				13,
				46,
				17,
				50,
				51,
				52,
				12,
				11,
				30,
				38,
				25,
				33,
				4,
				3,
				59,
				60,
				39,
				31,
				24,
				32,
				1,
				62,
				15,
				48,
				8,
				55,
				6,
				57,
				9,
				54,
				14,
				49
			];

	var hash = new Transposition();

	function sgn(n) {
		return n > 0 ? 1 : n < 0 ? -1 : 0;
	}

	function evaluation(m) {
		var evaluateFor = m.side == 1 ? ' X ' : ' O ';

		var corner = 0,
			steady = 0,
			uk = {};

		for (var i = 0, v, l = rnd.length; (v = rnd[i]), i < l; i++) {
			if (m[v.s] == 0) {
				corner += m[v.a] * -3;
				corner += m[v.b] * -3;
				corner += m[v.c] * -60;
				continue;
			}
			corner += m[v.s] * 75;
		}

		//var frontier = 0;

		last = 0;
		var ff = 0;
		dataBoards.forEach((element) => {
			m.slice(last, element).map((x) => {
				// row += x == 0 ? '   |' : x == -1 ? ' O |' : ' X |';
			});
			// row += '\r\n---------------------------------\r\n';
			last = element;
		});

		var frontier = 0;
		for (var i = 9; i <= 54; i += (i & 7) == 6 ? 3 : 1) {
			if (m[i] != m.side) continue;
			for (var j = 0; j < 8; j++) {
				var aa = othe.dire(i, j);
				if (m[othe.dire(i, j)] == 0) {
					if (m.side == m[i]) {
						frontier += 1;
					}

					//frontier -= m[i];
					break;
				}
			}
		}

		var fr = frontier; // evaluateFor == "X" ? frontierX : frontierO;

		generateText('Frontier =' + fr, 'top');
		generateText('Mobility  =' + m.nextNum, ' - ', m.nextIndex);
		generateText('Corner  =' + corner);
		generateText('Mobility - Fronteir + Corner  =' + (m.nextNum - fr + corner));

		var rv = m.nextNum - fr + corner;
		generateText('Analisa For : ' + evaluateFor + ' value = ' + rv);
		// if (rv > 50) {
		// 	console.log('%c Oh my heavens! ', 'background: #222; color: #bada55', 'more text');
		// }

		return rv;
	}

	function outcome(m) {
		var s = m.black - m.white;
		if (maxDepth >= outcomeCoarse) return sgn(s) * 10000 * m.side;
		return (s + m.space * sgn(s)) * 10000 * m.side;
	}

	Max = Infinity;
	Min = -Infinity;
	aiHistory = [];
	labelId = 1;
	bestMove = null;

	function MinMax(map, deep, isMax, alpha, beta) {
		othe.findLocation(map);
		if (deep == 2) {
			generateText('Evaluate Map For ', 'top');
			generateMap('id' + labelId++, map);
			var e = evaluation(map);
			const returnedTarget = Object.assign([], map);
			returnedTarget.side = map.side == 1 ? -1 : 1;
			othe.findLocation(returnedTarget);
			var f = evaluation(returnedTarget);
			var result = map.side == -1 ? e - f : f - e;
			generateText('Total Evaluasi =' + result, 'bottom');
			return result;
		}

		if (isMax) {
			var best = Min;
			for (var i = 0; i < map.nextIndex.length; i++) {
				var newMap = othe.newMap(map, map.nextIndex[i]);
				newMap.MapKey = map.nextIndex[i];
				generateText('MAX V=' + best + ' | alpha=' + alpha + ' | beta=' + beta, 'top');
				generateMap('max' + labelId++, newMap);
				val = MinMax(newMap, deep + 1, false, alpha, beta);
				best = Math.max(best, val);
				alpha = Math.max(alpha, best);
				if (alpha == Infinity) {
					bestMove = newMap.MapKey;
					break;
				}
				if (beta <= alpha) {
					generateText('Prune : ' + val, 'top');
					break;
				} else if (alpha == Infinity || (alpha != val && val > alpha)) {
					bestMove = newMap.MapKey;
				}
			}

			return best;
		} else {
			let best = Max;
			for (var i = 0; i < map.nextIndex.length; i++) {
				var newMap = othe.newMap(map, map.nextIndex[i]);
				newMap.MapKey = map.nextIndex[i];
				generateText('MIN  V=' + best + ' | alpha=' + alpha + ' | beta=' + beta, 'top');
				generateMap('min' + labelId++, newMap);
				val = MinMax(newMap, deep + 1, true, alpha, beta);

				best = Math.min(best, val);
				beta = Math.min(beta, best);

				if (beta <= alpha) {
					generateText('Prune : ' + val, 'top');
					break;
				} else if (alpha != best && (val < alpha || alpha == -Infinity)) {
					bestMove = map.MapKey;
				}
			}

			return best;
		}
	}

	oo.startSearch = function(m) {
		var f = 0;
		bestMove = null;
		var hm = document.getElementById('algoritmaView');
		hm.innerHTML = '';
		generateText('Start ...');
		generateMap('start' + labelId++, m);
		m.MapKey = null;

		var F = null;
		othe.findLocation(m);
		var best = MinMax(m, 0, true, -Infinity, Infinity);

		generateText('BEST MOVE : ' + bestMove);
		return bestMove;
	};
}

function Transposition() {
	var oo = this;
	var HASH_SIZE = (1 << 19) - 1;
	var data = new Array(HASH_SIZE + 1);

	oo.set = function(key, eva, depth, flags, best) {
		var keyb = key[0] & HASH_SIZE;
		var phashe = data[keyb];
		if (!phashe) phashe = data[keyb] = {};
		else if (phashe.key == key[1] && phashe.depth > depth) return;
		phashe.key = key[1];
		phashe.eva = eva;
		phashe.depth = depth;
		phashe.flags = flags;
		phashe.best = best;
	};

	oo.get = function(key, depth, alpha, beta) {
		var phashe = data[key[0] & HASH_SIZE];
		if (!phashe || phashe.key != key[1] || phashe.depth < depth) return false;
		switch (phashe.flags) {
			case 0:
				return phashe.eva;
			case 1:
				if (phashe.eva <= alpha) return phashe.eva;
				return false;
			case 2:
				if (phashe.eva >= beta) return phashe.eva;
				return false;
		}
	};

	oo.getBest = function(key) {
		var phashe = data[key[0] & HASH_SIZE];
		if (!phashe || phashe.key != key[1]) return null;
		return phashe.best;
	};
}

function AIBackup(othe) {
	var oo = this;
	oo.calculateTime = 1000;
	oo.outcomeDepth = 2;
	var outcomeCoarse = 2;
	var maxDepth = 2;
	var outTime;
	let dataBoards = [ 8, 16, 24, 32, 40, 48, 56, 64 ];
	var weight = [ 6, 11, 2, 2, 3 ];
	var rnd = [
		{
			s: 0,
			a: 1,
			b: 8,
			c: 9,
			dr: [ 1, 8 ]
		},
		{
			s: 7,
			a: 6,
			b: 15,
			c: 14,
			dr: [ -1, 8 ]
		},
		{
			s: 56,
			a: 57,
			b: 48,
			c: 49,
			dr: [ 1, -8 ]
		},
		{
			s: 63,
			a: 62,
			b: 55,
			c: 54,
			dr: [ -1, -8 ]
		}
	];

	oo.printMap = function(m) {
		let last = 0;
		var row = '';
		var items = [];
		dataBoards.forEach((element) => {
			row += '|';
			m.slice(last, element).map((x) => {
				row += x == 0 ? '   |' : x == -1 ? ' O |' : ' X |';
			});
			row += '\r\n---------------------------------\r\n';
			last = element;
		});

		console.log(row);
	};

	oo.history = [ [], [] ];
	for (var i = 0; i < 2; i++)
		for (var j = 0; j <= 60; j++)
			oo.history[i][j] = [
				0,
				63,
				7,
				56,
				37,
				26,
				20,
				43,
				19,
				29,
				34,
				44,
				21,
				42,
				45,
				18,
				2,
				61,
				23,
				40,
				5,
				58,
				47,
				16,
				10,
				53,
				22,
				41,
				13,
				46,
				17,
				50,
				51,
				52,
				12,
				11,
				30,
				38,
				25,
				33,
				4,
				3,
				59,
				60,
				39,
				31,
				24,
				32,
				1,
				62,
				15,
				48,
				8,
				55,
				6,
				57,
				9,
				54,
				14,
				49
			];

	var hash = new Transposition();

	function sgn(n) {
		return n > 0 ? 1 : n < 0 ? -1 : 0;
	}

	function evaluation(m) {
		var evaluateFor = m.side == 1 ? ' O ' : ' X ';
		console.log('Evaluate Map For ' + evaluateFor);
		generate('ev' + labelId++, m);
		var corner = 0,
			steady = 0,
			uk = {};
		for (var i = 0, v, l = rnd.length; (v = rnd[i]), i < l; i++) {
			if (m[v.s] == 0) {
				corner += m[v.a] * -3;
				corner += m[v.b] * -3;
				corner += m[v.c] * -60;
				continue;
			}
			corner += m[v.s] * 75;
		}

		var frontier = 0;
		var frontierX = 0;
		var frontierO = 0;
		for (var i = 9; i <= 54; i += (i & 7) == 6 ? 3 : 1) {
			if (m[i] == 0) continue;
			for (var j = 0; j < 8; j++)
				if (m[othe.dire(i, j)] == 0) {
					if (m[i] == 1) {
						frontierX += 1;
					} else {
						frontierO += 1;
					}
					frontier -= m[i];
					break;
				}
		}

		var mobility = m.nextNum;
		var rv = corner + frontier + (m.nextNum - m.prevNum);
		console.log('Frontier =' + frontier);
		console.log('Corner  =' + corner);
		console.log('Mobility' + evaluateFor + '(' + m.nextNum + '-' + m.prevNum + ')  =' + (m.nextNum - m.prevNum));
		console.log('Analisa For : ' + m.side + ' value = ' + rv * m.side + '\r\n\r\n');

		return rv * m.side;
	}

	function outcome(m) {
		var s = m.black - m.white;
		if (maxDepth >= outcomeCoarse) return sgn(s) * 10000 * m.side;
		return (s + m.space * sgn(s)) * 10000 * m.side;
	}

	oo.startSearch = function(m) {
		var f = 0;
		console.log('Start ...\n\r');
		if (m.space <= oo.outcomeDepth) {
			outTime = new Date().getTime() + 600000;
			maxDepth = m.space;

			if (maxDepth >= outcomeCoarse) f = alphaBeta(m, maxDepth, -Infinity, Infinity);
			else f = mtd(m, maxDepth, f);

			console.log('End-game search result：', maxDepth, m.space, m.side, f * m.side);
			return hash.getBest(m.key);
		}

		outTime = new Date().getTime() + oo.calculateTime;
		maxDepth = 0;

		try {
			//Maximum Deep Serach Here
			while (maxDepth < oo.outcomeDepth) {
				console.log('Deep : ' + (maxDepth + 1));
				f = mtd(m, ++maxDepth, f);

				var best = hash.getBest(m.key);
				console.log(maxDepth, f * m.side, best);
			}
		} catch (eo) {
			if (eo.message != 'time out') throw eo;
		}

		console.log('Search result：', maxDepth - 1, m.space, m.side, f * m.side);
		return best;
	};

	function mtd(m, depth, f) {
		var lower = -Infinity;
		var upper = Infinity;
		do {
			var beta = f == lower ? f + 1 : f;
			f = alphaBeta(m, depth, beta - 1, beta);
			if (f < beta) upper = f;
			else lower = f;
		} while (lower < upper);
		if (f < beta) {
			f = alphaBeta(m, depth, f - 1, f);
		}
		console.log('F >= beta：', f, beta);
		return f;
	}

	function alphaBeta(m, depth, alpha, beta) {
		//	if (new Date().getTime() > outTime) throw new Error('time out');

		var hv = hash.get(m.key, depth, alpha, beta);
		if (hv !== false) return hv;

		if (m.space == 0) return outcome(m);
		othe.findLocation(m);
		if (m.nextNum == 0) {
			if (m.prevNum == 0) return outcome(m);
			othe.pass(m);
			return -alphaBeta(m, depth, -beta, -alpha);
		}

		if (depth <= 0) {
			var e = evaluation(m);
			hash.set(m.key, e, depth, 0, null);
			return e;
		}

		var hd = hash.getBest(m.key);
		if (hd !== null) moveToHead(m.nextIndex, hd);

		var hist = oo.history[m.side == 1 ? 0 : 1][m.space];
		var hashf = 1;
		var bestVal = -Infinity;
		var bestAct = null;
		for (var i = 0; i < m.nextNum; i++) {
			var n = m.nextIndex[i];
			var v = -alphaBeta(othe.newMap(m, n), depth - 1, -beta, -alpha);
			if (v > bestVal) {
				bestVal = v;
				bestAct = n;
				if (v > alpha) {
					alpha = v;
					hashf = 0;
					moveToUp(hist, n);
					console.log('V Naik Ke Atas = ' + v, n - i);
				}
				if (v >= beta) {
					hashf = 2;
					console.log('Stop For Prun ' + v + '>=' + beta);
					break;
				}
			} else console.log('Kesamping   = ' + v);
		}
		moveToHead(hist, bestAct);

		hash.set(m.key, bestVal, depth, hashf, bestAct);

		return bestVal;
	}

	function moveToHead(arr, n) {
		//console.log('Move To Head : ' + n);
		if (arr[0] == n) return;
		var i = arr.indexOf(n);
		arr.splice(i, 1);
		arr.unshift(n);
	}

	function moveToUp(arr, n) {
		if (arr[0] == n) return;
		var i = arr.indexOf(n);
		arr[i] = arr[i - 1];
		arr[i - 1] = n;
	}
}

function generateMap(id, m) {
	var hm = document.getElementById('algoritmaView');
	g = document.createElement('div');
	g.innerHTML = '';
	g.setAttribute('id', 'board' + id);
	g.setAttribute('class', 'historyBoard');
	hm.appendChild(g);

	var obj = document.getElementById('board' + id);
	var html = "<table class='table historyTable' >";
	for (var i = 0; i < 8; i++) {
		html += '<tr>';
		for (var j = 0; j < 8; j++) html += "<td class='bg" + (j + i) % 2 + "'><div></div></td>";
		html += '</tr>';
	}
	html += '</table>';
	obj.innerHTML = html;
	pieces = obj.getElementsByTagName('div');
	bindEvent(obj.getElementsByTagName('td'));
	//piecesnum = document.getElementById('score').getElementsByTagName('span');

	if (!m) {
		var aaaa = 'test';
	} else {
		for (var i = 0; i < 64; i++) {
			pieces[i].className = [ 'whiteHistory', '', 'blackHistory' ][m[i] + 1];
		}
	}
}

function generateText(text, marginOn) {
	var hm = document.getElementById('algoritmaView');
	g = document.createElement('div');
	g.innerHTML = '';
	if (marginOn == 'top') g.setAttribute('class', 'topLabel');
	else if (marginOn == 'bottom') g.setAttribute('class', 'bottomLabel');
	else g.setAttribute('class', 'middleLabel');

	hm.appendChild(g);

	var comment = '<span>' + text + '</span>';
	g.innerHTML = comment;
}
