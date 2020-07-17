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
        var evaluateFor = (m.side == 1 ? ' O ' : ' X ');
        console.log('Evaluate Map For ' + evaluateFor);
		oo.printMap(m);
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
        console.log('Mobility' + evaluateFor + '(' + m.nextNum + "-" + m.prevNum + ')  =' + (m.nextNum - m.prevNum));
		//oo.printMap(m);
        console.log('Analisa For : ' + m.side + ' value = ' + rv + '\r\n\r\n');
        if (rv > 50) {
            console.log('%c Oh my heavens! ', 'background: #222; color: #bada55',
                'more text');
        }
		return rv;
	}

	function outcome(m) {
		var s = m.black - m.white;
		if (maxDepth >= outcomeCoarse) return sgn(s) * 10000 * m.side;
		return (s + m.space * sgn(s)) * 10000 * m.side;
    }

    Max = Infinity;
    Min = -Infinity;
    maxDeep = 3;
    aiHistory = [];

    function MinMax(map, deep, isMax, alpha, beta) {
        othe.findLocation(map);
        
        if (deep == maxDepth) {
            var e = evaluation(map);
            return e;
        }

      

        if (isMax) {
            best = Min;
            for (var i = 0; i < map.nextIndex.length; i++) {
                var newMap = othe.newMap(map, map.nextIndex[i]);
                newMap.MapKey = map.nextIndex[i];
                oo.printMap(newMap);
                console.log("V=", best, " |alpha=", alpha, " |betha=", beta)
                val = MinMax(newMap, deep + 1, false, alpha, beta);
                best = Math.max(best, val);
                alpha = Math.max(alpha, best);



                console.log("V=", best, " - ", newMap.MapKey);
                if (beta <= alpha) {
                    console.log("Prune", val)
                    break;
                } else {
                    aiHistory.push({ a: best, key: map.MapKey, isMax: false });
                }

               
            }

            return best;


        } else {
            best = Max;

            for (var i = 0; i < map.nextIndex.length; i++) {
                var newMap = othe.newMap(map, map.nextIndex[i]);
                newMap.MapKey = map.nextIndex[i];
                oo.printMap(newMap);
                console.log("V=", best, " |alpha=", alpha, " |betha=", beta)
                val = MinMax(newMap,deep + 1, true, alpha, beta);
                best = Math.min(best, val);
                beta = Math.min(beta, best);

                console.log("V=", best, " - ", newMap.MapKey);
              
                if (beta <= alpha) {
                    console.log("Prune", val)
                    break;
                } else {
                    aiHistory.push({ a: best, key: map.MapKey, isMax: true });
                }

               
            }

            return best;
        }
    }




    oo.startSearch = function (m) {
        var f = 0;
        console.log('Start ...\n\r');

        oo.printMap(m);
        m.MapKey = null;

        var best = MinMax(m, 0, false, -Infinity, Infinity);







/*
        var level1 = [];
        m.nextIndex.forEach(x => {
            var newArray = othe.newMap(m, x);
            level1.push(newArray);
            othe.findLocation(newArray);
            oo.printMap(newArray);
        })*//*
        var level1 = [];
        m.nextIndex.forEach(x => {
            var newArray = othe.newMap(m, x);
            level1.push(newArray);
            othe.findLocation(newArray);
            oo.printMap(newArray);
        })*/
        var a = aiHistory[aiHistory.length - 1];;
        return a.key;


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
            console.log('F < beta：', f, beta);
		}else
		    console.log('F >= beta：', f, beta);
		return f;
	}

	function alphaBeta(m, depth, alpha, beta) {
		//	if (new Date().getTime() > outTime) throw new Error('time out');

		var hv = hash.get(m.key, depth, alpha, beta);
        if (hv !== false) {
            console.log("retun rv : ", hv)
            return hv;
        };

		if (m.space == 0) return outcome(m);
		othe.findLocation(m);
		if (m.nextNum == 0) {
            if (m.prevNum == 0) {
                return outcome(m);
            }
			othe.pass(m);
			return -alphaBeta(m, depth, -beta, -alpha);
		}

        if (depth <= 0) {
            var e = evaluation(m);
            hash.set(m.key, e, depth, 0, null);
            return e;
        } else {
            console.log("Turun Karena Belum Di Dasar Ke :", (oo.outcomeDepth - depth) + 1);
          //  oo.printMap(m);
        }

		var hd = hash.getBest(m.key);
		if (hd !== null) moveToHead(m.nextIndex, hd);

		var hist = oo.history[m.side == 1 ? 0 : 1][m.space];
		var hashf = 1;
		var bestVal = -Infinity;
		var bestAct = null;
		for (var i = 0; i < m.nextNum; i++) {
            var n = m.nextIndex[i];
            var newArray = othe.newMap(m, n);
            var v = -alphaBeta(newArray, depth - 1, -beta, -alpha);
            if (v > bestVal) {
                bestVal = v;
                bestAct = n;
                if (v > alpha) {
                    alpha = v;
                    hashf = 0;
                    moveToUp(hist, n);
                    console.log('V Naik Ke Atas = ' + v, n - i);
                    printVAB(v, alpha, beta);
                    if (maxDepth == 0) {
                        var newArray = othe.newMap(m, n);
                        oo.printMap(newArray);
                    }
                 
                }
                if (v >= beta) {
                    hashf = 2;
                    console.log('Stop For Prun ' + v + '>=' + beta);
                    printVAB(v, alpha, beta);
                    if (maxDepth == 0) {
                        var newArray = othe.newMap(m, n);
                        oo.printMap(newArray);
                    }
                    break;
                }
            } else {
                var newArray = othe.newMap(m, n);
                oo.printMap(newArray);
                printVAB(v, alpha, beta);
                console.log('Naik Dan Turun  = ' + v);
            }
		}
		moveToHead(hist, bestAct);

		hash.set(m.key, bestVal, depth, hashf, bestAct);

		return bestVal;
    }


    function printVAB(v, a, b) {
        console.log("v=", v, " a=", a, " b=", b,"\n\r");

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
    let dataBoards = [8, 16, 24, 32, 40, 48, 56, 64];
    var weight = [6, 11, 2, 2, 3];
    var rnd = [
        {
            s: 0,
            a: 1,
            b: 8,
            c: 9,
            dr: [1, 8]
        },
        {
            s: 7,
            a: 6,
            b: 15,
            c: 14,
            dr: [-1, 8]
        },
        {
            s: 56,
            a: 57,
            b: 48,
            c: 49,
            dr: [1, -8]
        },
        {
            s: 63,
            a: 62,
            b: 55,
            c: 54,
            dr: [-1, -8]
        }
    ];

    oo.printMap = function (m) {
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

    oo.history = [[], []];
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
        var evaluateFor = (m.side == 1 ? ' O ' : ' X ');
        console.log('Evaluate Map For ' + evaluateFor);
        oo.printMap(m);
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
        console.log('Mobility' + evaluateFor + '(' + m.nextNum + "-" + m.prevNum + ')  =' + (m.nextNum - m.prevNum));
        //oo.printMap(m);
        console.log('Analisa For : ' + m.side + ' value = ' + rv * m.side + '\r\n\r\n');

        return rv * m.side;
    }

    function outcome(m) {
        var s = m.black - m.white;
        if (maxDepth >= outcomeCoarse) return sgn(s) * 10000 * m.side;
        return (s + m.space * sgn(s)) * 10000 * m.side;
    }

    oo.startSearch = function (m) {
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

