('use strict');
angular.module('data.service', []).factory('GameService', GameService).factory('PlayerService', PlayerService);

function PlayerService($q, message, $state) {
	var service = {};
	service.MyUserName = '';
	service.players = [];
	service.connection = new signalR.HubConnectionBuilder().withUrl('/gameHub').build();
	service.start = () => {
		service.connection
			.start()
			.then(function() {
				service.connection.invoke('GetUsers');
			})
			.catch(function(err) {
				return console.error(err.toString());
			});
	};

	service.connection.on('OnInvite', function(userId) {
		var player = service.players.find((x) => x.userId == userId);
		message.dialog(player.playerName + ' Mengajak Anda Untuk Bermain', 'Terima', 'Tolak').then((x) => {
			service.connection.invoke('Join', userId);
		});
	});
	service.connection.on('OnStart', function(game) {
		$state.go('game-play', { data: game });
	});

	service.getMyUserId = () => {
		var userId = document.getElementById('userId').value;
		if (userId) return userId;
		return null;
	};

	return service;
}

function GameService($http, PlayerService, $state, $q) {
	var service = {};
	service.mePlay = false;
	var othe = null;
	var vsComputer = false;
	service.MyProfile = {};
	service.AiPlay = () => {
		othe.AiGo();
	};

	service.resign = () => {
		PlayerService.connection.invoke('Resign');
	};

	service.start = (game) => {
		othe = new OthelloOnline(PlayerService.connection);
		othe.game = game;
		othe.board.create();
		othe.toDown = othe.goChess;
		var myid = PlayerService.getMyUserId();
		othe.pion = game.owner.userId == myid ? 1 : -1;
		othe.mePlay = true;
		service.mePlay = othe.mePlay;

		if (othe.pion == -1) {
			var chessB = document.getElementById('chessboard');
			chessB.className = 'opponent';
			othe.mePlay = false;
		} else {
			othe.timerStart();
		}
		othe.play();

		othe.connection.on('OnPlay', function(n) {
			othe.mePlay = true;
			othe.go(n);
			othe.timerStart();
		});

		othe.connection.on('OnResign', function(param) {
			service.game = null;
			if (param == othe.pion) {
				alert('You Lost');
			} else {
				alert('You Win');
			}
			$state.go('game-home');
		});

		othe.connection.on('OnError', function(code, message) {
			switch (code) {
				case 100:
					alert(message);
					return;
				case 101:
					alert(message);
					return;
				default:
					alert(message);
			}
		});
		var ro = document.getElementById('selectbox').getElementsByTagName('input');
		othe.aiSide = ro[0].checked ? -1 : 1;
		// for (var i = 2; i < ro.length; i++) {
		// 	if (ro[i].checked) break;
		// }
		ai.calculateTime = [ 20, 100, 500, 2000, 5000, 10000, 20000 ][i - 2];
		ai.outcomeDepth = [ 3, 6, 9, 12, 15, 18, 21 ][i - 2];

		// othe.connection.invoke('SearchOpponent').catch(function(err) {
		// 	console.error(err.toString());
		// });

		document.getElementById('2d3d').onclick = function() {
			var desk = document.getElementById('desk');
			desk.className = desk.className == 'fdd' ? '' : 'fdd';
			this.innerHTML = desk.className == 'fdd' ? '2D' : '3D';
		};
	};

	service.startVsComputer = (params) => {
		othe = new Othello();
		vsComputer = true;
		othe.aiRuning = true;
		othe.board.create();

		othe.pion = params.pion;
		if (othe.pion == -1) {
			var chessB = document.getElementById('chessboard');
			chessB.className = 'opponent';
			othe.mePlay = true;
		} else {
			othe.timerStart();
		}

		othe.aiSide = othe.pion == 1 ? -1 : 1;

		if (othe.aiSide) {
			othe.mePlay = false;
		} else {
			othe.mePlay = true;
		}
		othe.ai.calculateTime = [ 20, 100, 500, 2000, 5000, 10000, 20000 ][params.level];
		othe.ai.outcomeDepth = [ 3, 5, 10, 16, 17 ][params.level];
		othe.play();

		document.getElementById('2d3d').onclick = function() {
			var desk = document.getElementById('desk');
			desk.className = desk.className == 'fdd' ? '' : 'fdd';
			this.innerHTML = desk.className == 'fdd' ? '2D' : '3D';
		};
	};

	return service;
}
