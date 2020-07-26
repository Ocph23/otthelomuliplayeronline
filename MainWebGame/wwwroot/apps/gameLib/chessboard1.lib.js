function Chessboard() {
	var chessBoard = this;
	var pieces;
	var piecesnum;
	var side;
	chessBoard.toDown = null;
	function bindEvent(td) {
		for (var i = 0; i < 64; i++)
			(function(i) {
				td[i].onclick = function() {
					if (pieces[i].className == 'prompt') chessBoard.toDown(i);
				};
			})(i);
		td = undefined;
	}

	chessBoard.create = function() {
		var obj = document.getElementById('idTable');
		var html = '';
		for (var i = 0; i < 8; i++) {
			html += '<tr>';
			for (var j = 0; j < 8; j++) html += "<td class='bg" + (j + i) % 2 + "'><div></div></td>";
			html += '</tr>';
		}
		obj.innerHTML = html;
		pieces = obj.getElementsByTagName('div');
		bindEvent(obj.getElementsByTagName('td'));
		piecesnum = document.getElementById('score').getElementsByTagName('span');
		side = {
			'1': document.getElementById('side1'),
			'-1': document.getElementById('side2')
		};
	};

	chessBoard.update = function(m, nop) {
		for (var i = 0; i < 64; i++) pieces[i].className = [ 'white', '', 'black' ][m[i] + 1];
		if (nop) {
			for (var n in m.next) {
				pieces[n].className = 'prompt';
			}
		}
		for (var i = 0; i < m.newRev.length; i++) pieces[m.newRev[i]].className += ' reversal';
		if (m.newPos != -1) {
			pieces[m.newPos].className += ' newest';
		}
		piecesnum[0].innerHTML = m.black;
		piecesnum[1].innerHTML = m.white;
		side[m.side].className = 'cbox side';
		side[-m.side].className = 'cbox';
	};
}
