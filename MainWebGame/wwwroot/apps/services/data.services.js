('use strict');
angular
	.module('data.service', [])
	.factory('GameService', GameService)
	.factory('PeraturanService', PeraturanService)
	.factory('PlayerService', PlayerService);

function PlayerService($q, message, $state, AuthService) {
	var service = {};
	service.MyUserName = '';
	service.players = [];

	service.start = () => {
		service.connection = new signalR.HubConnectionBuilder()
			.withUrl('/gameHub', {
				// transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
				// 'content-type': 'application/json',
				accessTokenFactory: () => AuthService.getToken()
			})
			.configureLogging(signalR.LogLevel.Information)
			.withAutomaticReconnect()
			.build();
		service.connection
			.start()
			.then(function(x) {
				service.connection.invoke('GetUsers');
				setTimeout(() => {}, 500);
			})
			.catch(function(err) {
				return console.error(err.toString());
			});

		service.connection.on('OnInvite', function(userId) {
			var player = service.players.find((x) => x.userId == userId);
			message.dialog(player.playerName + ' Mengajak Anda Untuk Bermain', 'Terima', 'Tolak').then(
				(x) => {
					service.connection.invoke('Join', userId);
				},
				(err) => {
					service.connection.invoke('RejectInvite', userId);
				}
			);
		});
		service.connection.on('OnStart', function(game) {
			$state.go('game-play', { data: game });
		});
	};

	return service;
}

function GameService($http, PlayerService, $state, $q, $transitions) {
	$transitions.onStart(
		{},
		function(transitions) {
			var name = transitions.from().name;
			if (name == 'game-vs-ai' || name == 'game-play') {
				var result = confirm('Yakin MeninggalKan Permainan ? ');
				if (result && name == 'game-play') {
					service.resign();
				}

				return result;
			} else {
				return true;
			}
		},
		(err) => {}
	);
	var service = {};
	service.mePlay = null;
	var othe = null;
	var vsComputer = false;
	service.MyProfile = {};
	service.AiPlay = () => {
		othe.AiGo();
	};

	service.getOtthelo = () => {
		return othe;
	};

	service.resign = () => {
		if (PlayerService.connection) {
			PlayerService.connection.invoke('Resign');
		}
	};

	service.start = (game) => {
		othe = new OthelloOnline(PlayerService.connection, game.mePlay);
		othe.game = game;
		othe.board.create();
		othe.toDown = othe.goChess;
		var myid = service.MyProfile.idUser;
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
		othe = new Othello(params);
		vsComputer = true;
		othe.aiRuning = true;
		othe.board.create();
		othe.pion = params.pion;

		if (othe.pion == -1) {
			var chessB = document.getElementById('chessboard');
			chessB.className = 'opponent';
		}

		othe.aiSide = othe.pion == 1 ? -1 : 1;
		if (othe.aiSide) {
			othe.mePlay = false;
		} else {
			othe.mePlay = true;
		}
		service.mePlay = othe.getMePlay;
		othe.ai.calculateTime = [ 20, 100, 500, 2000, 5000, 10000, 20000 ][params.level - 1];
		othe.ai.outcomeDepth = 2; // [ 2, 3, 4, 5, 6, 7, 8 ][params.level - 1];
		othe.play();

		document.getElementById('2d3d').onclick = function() {
			var desk = document.getElementById('desk');
			desk.className = desk.className == 'fdd' ? '' : 'fdd';
			this.innerHTML = desk.className == 'fdd' ? '2D' : '3D';
		};
	};

	service.getHistory = () => {
		return othe.getHistory();
	};

	return service;
}

function PeraturanService($http, $q, message, helperServices, AuthService) {
	var controller = '/api/peraturan';
	var service = {};

	service.isInstance = false;

	service.get = () => {
		var def = $q.defer();
		if (service.isInstance) def.resolve(service.data);
		else {
			$http({
				method: 'get',
				url: helperServices.url + controller,
				headers: AuthService.getHeader()
			}).then(
				(res) => {
					service.isInstance = true;
					service.data = res.data;
					def.resolve(res.data);
				},
				(err) => {
					message.error(err);
					def.reject();
				}
			);
		}

		return def.promise;
	};

	service.getPemain = () => {
		var def = $q.defer();
		if (service.isInstancePemain) def.resolve(service.dataPemain);
		else {
			$http({
				method: 'get',
				url: helperServices.url + '/api/pemain',
				headers: AuthService.getHeader()
			}).then(
				(res) => {
					service.isInstancePemain = true;
					service.dataPemain = res.data;
					def.resolve(res.data);
				},
				(err) => {
					message.error(err);
					def.reject();
				}
			);
		}

		return def.promise;
	};

	service.getTantangan = () => {
		var def = $q.defer();
		$http({
			method: 'get',
			url: helperServices.url + '/api/tantangan',
			headers: AuthService.getHeader()
		}).then(
			(res) => {
				def.resolve(res.data);
			},
			(err) => {
				message.error(err);
				def.reject();
			}
		);
		return def.promise;
	};

	service.getHistory = (id) => {
		var def = $q.defer();
		$http({
			method: 'get',
			url: helperServices.url + '/api/bantuan?id=' + id,
			headers: AuthService.getHeader()
		}).then(
			(res) => {
				def.resolve(res.data);
			},
			(err) => {
				message.error(err);
				def.reject();
			}
		);
		return def.promise;
	};

	service.getPeringkat = () => {
		var def = $q.defer();
		$http({
			method: 'get',
			url: helperServices.url + '/api/peringkat',
			headers: AuthService.getHeader()
		}).then(
			(res) => {
				def.resolve(res.data);
			},
			(err) => {
				message.error(err);
				def.reject();
			}
		);
		return def.promise;
	};

	service.getStatistik = (userid) => {
		var def = $q.defer();
		$http({
			method: 'get',
			url: helperServices.url + '/api/statistic?userId=' + userid,
			headers: AuthService.getHeader()
		}).then(
			(res) => {
				def.resolve(res.data);
			},
			(err) => {
				message.error(err);
				def.reject();
			}
		);
		return def.promise;
	};

	service.post = (data) => {
		var def = $q.defer();
		$http({
			method: 'post',
			url: helperServices.url + controller,
			headers: AuthService.getHeader(),
			data: data
		}).then(
			(res) => {
				service.data.push(res.data);
				def.resolve(res.data);
			},
			(err) => {
				message.error(err);
				def.reject();
			}
		);

		return def.promise;
	};

	service.put = (data) => {
		var def = $q.defer();
		$http({
			method: 'put',
			url: helperServices.url + controller,
			headers: AuthService.getHeader(),
			data: data
		}).then(
			(res) => {
				var item = service.data.find((x) => x.idPeraturan == data.idPeraturan);
				if (item) {
					item.keterangan = data.keterangan;
				}
				def.resolve(res.data);
			},
			(err) => {
				message.error(err);
				def.reject();
			}
		);

		return def.promise;
	};

	service.delete = (id) => {
		var def = $q.defer();
		$http({
			method: 'delete',
			url: helperServices.url + controller + '?id=' + id,
			headers: AuthService.getHeader()
		}).then(
			(res) => {
				var item = service.data.find((x) => (x.idPeraturan = id));
				var index = service.data.indexOf(item);
				service.data.splice(index, 1);
				def.resolve(res.data);
			},
			(err) => {
				message.error(err);
				def.reject();
			}
		);

		return def.promise;
	};

	service.deletePemain = (model) => {
		var def = $q.defer();
		$http({
			method: 'delete',
			url: helperServices.url + '/api/pemain/?id=' + model.id,
			headers: AuthService.getHeader()
		}).then(
			(res) => {
				var item = service.dataPemain.find((x) => (x.id = model.id));
				var index = service.dataPemain.indexOf(item);
				service.dataPemain.splice(index, 1);
				def.resolve(res.data);
			},
			(err) => {
				message.error(err);
				def.reject();
			}
		);

		return def.promise;
	};

	return service;
}
