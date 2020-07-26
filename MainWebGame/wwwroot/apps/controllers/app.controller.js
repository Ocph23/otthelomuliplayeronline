angular
	.module('app.controller', [])
	.controller('gameController', gameController)
	.controller('gameHomeController', gameHomeController)
	.controller('peringkatController', peringkatController)
	.controller('profileController', profileController)
	.controller('aturanController', aturanController)
	.controller('gameVsComputerController', gameVsComputerController)
	.controller('gamePlayController', gamePlayController);

function gameController($scope, $state, AuthService, PlayerService, helperServices, swangular, GameService) {
	$scope.profile = {};

	AuthService.profile().then(
		(x) => {
			if (x.role.toLowerCase() != 'player') {
				$state.go('login');
			}

			$scope.profile = x;
			if (x.photo) {
				$scope.photox = 'data:image/png;base64,' + x.photo;
			} else {
				setTimeout(() => {
					$scope.photox = helperServices.url + '/images/noimage.png';
				}, 100);
			}
		},
		(err) => {
			$state.go('login');
		}
	);
	$scope.logoff = () => {
		if (PlayerService.connection.connectionState == 'Connected') {
			PlayerService.connection.stop();
		}
		AuthService.logOff();
	};
}

function gameHomeController($scope, PlayerService, $state, message, AuthService) {
	AuthService.profile().then(
		(x) => {
			if (x.role.toLowerCase() != 'player') {
				$state.go('login');
			}
			$scope.profile = x;
			$scope.photos = x.photo;
			$scope.userId = $scope.profile.idUser;
			if (!PlayerService.connection || PlayerService.connection.connectionState == 'Disconnected') {
				PlayerService.start();
				PlayerService.connection.on('Users', (players) => {
					$scope.$apply((x) => {
						PlayerService.players = players.filter((x) => x.userId != $scope.userId);
						PlayerService.MyAccount = players.find((x) => x.userId == $scope.userId);
					});
				});
				PlayerService.connection.on('OnOnlinePlayer', (player) => {
					setTimeout(() => {
						$scope.$apply((x) => {
							userExist = $scope.playerService.players.find((x) => x.userId == player.userId);
							if (!userExist) $scope.playerService.players.push(player);
							else {
								userExist.connectionId = player.connectionId;
							}
						});
					}, 2000);
				});

				PlayerService.connection.on('OnOfflinePlayer', (userId) => {
					$scope.$apply((x) => {
						userExist = $scope.playerService.players.find((x) => x.userId == userId);
						if (userExist) {
							var index = $scope.playerService.players.indexOf(userExist);
							$scope.playerService.players.splice(index, 1);
						}
					});
				});

				PlayerService.connection.on('PlayerIsPlay', (players) => {
					$scope.$apply((x) => {
						players.forEach((element) => {
							var player = $scope.playerService.players.find((x) => x.userId == element);
							if (player) player.playing = true;
						});
					});
				});

				PlayerService.connection.on('PlayerNotPlay', (players) => {
					$scope.$apply((x) => {
						players.forEach((element) => {
							var player = $scope.playerService.players.find((x) => x.userId == element);
							if (player) player.playing = false;
						});
					});
				});
			}
		},
		(err) => {
			$state.go('login');
		}
	);

	$scope.playerService = PlayerService;

	$scope.play = () => {
		$state.go('game-play', { player: PlayerService.MyAccount });
	};

	$scope.playVsComputer = () => {
		$state.go('game-vs-ai', { roles: { pion: 1, deep: 2 } });
	};

	$scope.fireMessage = () => {
		message.dialog('Test').then((x) => {});
	};
}

function gamePlayController($scope, GameService, $state, $stateParams, AuthService) {
	AuthService.profile().then(
		(x) => {
			if (x.role.toLowerCase() != 'player') {
				$state.go('login');
			}
			GameService.MyProfile = x;
			if ($stateParams.data) {
				$scope.side1 = $stateParams.data.owner.playerName;
				$scope.side2 = $stateParams.data.opponent.playerName;
				setTimeout(() => {
					$stateParams.data.mePlay = $scope.changeMePlay;
					GameService.start($stateParams.data);
				}, 500);
			} else {
				$state.go('player-home');
			}
		},
		(err) => {
			$state.go('login');
		}
	);

	$scope.changeMePlay = (data) => {
		$scope.$apply((x) => {
			$scope.mePlay = data;
		});
	};

	$scope.resign = () => {
		GameService.resign();
		$state.go('player-home');
	};

	$scope.AiPlay = () => {
		GameService.AiPlay();
	};
	$scope.showHistory = () => {
		$scope.datas = GameService.getHistory();
		var historyMain = document.getElementById('historyMain');
		historyMain.innerHTML = '';
		var id = 1;

		generateHeader(historyMain, 'Awal');
		generateHeader(historyMain, 'Akhir');

		for (let index = 0; index < $scope.datas.length; index++) {
			if (index > 1) {
				generate(historyMain, id++, $scope.datas[index - 1]);
				generate(historyMain, id++, $scope.datas[index]);
			} else {
				generate(historyMain, id++, $scope.datas[index]);
			}
		}
	};
}

function gameVsComputerController($scope, $state, GameService, $state, AuthService) {
	$scope.model = {};

	AuthService.profile().then((x) => {
		$scope.profile = x;
		$scope.photos = x.photo;
		$scope.userId = $scope.profile.IdUser;
		$scope.model = { pion: '1', level: '2' };
		$('#exampleModal').modal('show');
	});

	$scope.changeMePlay = (data) => {
		setTimeout(() => {
			$scope.$apply((x) => {
				$scope.mePlay = data;
			});
		});
	};

	$scope.start = (params) => {
		if (params.pion == 1) {
			$scope.side1 = $scope.profile.playerName;
			$scope.side2 = 'Computer';
		} else {
			$scope.side2 = $scope.profile.playerName;
			$scope.side1 = 'Computer';
		}
		params.mePlay = $scope.changeMePlay;

		GameService.startVsComputer(params);
		$scope.otthe = GameService.getOtthelo();
	};

	$scope.cancel = () => {
		setTimeout(() => {
			$state.go('player-home');
		}, 500);
	};

	$scope.AiPlay = () => {
		GameService.AiPlay();
	};

	$scope.resign = () => {
		$state.go('player-home');
	};

	$scope.showHistory = () => {
		$scope.datas = GameService.getHistory();
		var historyMain = document.getElementById('historyMain');
		historyMain.innerHTML = '';
		var id = 1;

		generateHeader(historyMain, 'Awal');
		generateHeader(historyMain, 'Akhir');

		for (let index = 0; index < $scope.datas.length; index++) {
			if (index > 1) {
				generate(historyMain, id++, $scope.datas[index - 1]);
				generate(historyMain, id++, $scope.datas[index]);
			} else {
				generate(historyMain, id++, $scope.datas[index]);
			}
		}
	};
}

function peringkatController($scope, PlayerService, PeraturanService) {
	$scope.playerService = PlayerService;
	PeraturanService.getPeringkat().then((x) => {
		$scope.datas = x;
	});
}

function aturanController($scope, PlayerService, PeraturanService) {
	$scope.playerService = PlayerService;

	PeraturanService.get().then((x) => {
		$scope.datas = x;
	});
}

function profileController($scope, PlayerService, PeraturanService, AuthService) {
	$scope.playerService = PlayerService;

	AuthService.profile().then(
		(x) => {
			$scope.profile = x;
			if (x.role.toLowerCase() != 'player') {
				$state.go('login');
			}

			PeraturanService.getStatistik(x.idUser).then((x) => {
				$scope.datas = x;
				$scope.resume = x.resume;
				var labels = [];
				var datas = [];
				x.data.forEach((element) => {
					labels.push(element.label);
					datas.push(element.score);
				});

				var ctx = document.getElementById('myChart').getContext('2d');
				var chart = new Chart(ctx, {
					// The type of chart we want to create
					type: 'line',

					// The data for our dataset
					data: {
						labels: labels,
						datasets: [
							{
								label: 'Score',
								borderColor: 'rgb(255, 193, 7)',
								data: datas
							}
						]
					},

					// Configuration options go here
					options: {
						legend: {
							labels: {
								fontColor: 'white',
								fontSize: 18
							}
						},
						scales: {
							yAxes: [
								{
									ticks: {
										fontColor: 'white',
										fontSize: 12,
										beginAtZero: true
									}
								}
							],
							xAxes: [
								{
									ticks: {
										fontColor: 'white',
										fontSize: 13,
										beginAtZero: true
									}
								}
							]
						}
					}
				});

				PeraturanService.getTantangan().then((x) => {
					$scope.dataTantangan = x.filter(
						(x) => x.idUser == $scope.profile.idUser || x.idLawan == $scope.profile.idUser
					);
				});
			});
		},
		(err) => {
			$state.go('login');
		}
	);

	$scope.getHistory = (id) => {
		PeraturanService.getHistory(id).then((x) => {
			$scope.history = x;
			var othello = new OthelloView({ pion: 1 });
			othello.play();

			x.forEach((element) => {
				var map = othello.goChess(element.akhir);
			});

			$scope.histories = othello.getHistory();
			var historyMain = document.getElementById('historyMain');
			historyMain.innerHTML = '';
			var id = 1;

			generateHeader(historyMain, 'Awal');
			generateHeader(historyMain, 'Akhir');

			for (let index = 0; index < $scope.histories.length; index++) {
				if (index > 1) {
					generate(historyMain, id++, $scope.histories[index - 1]);
					generate(historyMain, id++, $scope.histories[index]);
				} else {
					generate(historyMain, id++, $scope.histories[index]);
				}
			}
		});
	};
}

function generate(historyMain, id, m) {
	g = document.createElement('div');
	g.innerHTML = '';
	g.setAttribute('id', 'board' + id);
	g.setAttribute('class', 'historyBoard');
	historyMain.appendChild(g);

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
	piecesnum = document.getElementById('score').getElementsByTagName('span');
	side = {
		'1': document.getElementById('side1'),
		'-1': document.getElementById('side2')
	};

	for (var i = 0; i < 64; i++) {
		pieces[i].className = [ 'whiteHistory', '', 'blackHistory' ][m[i] + 1];
	}
}

function generateHeader(historyMain, name) {
	g = document.createElement('div');
	g.setAttribute('id', name);
	historyMain.appendChild(g);
	var html = name;
	g.innerHTML = html;
}

function bindEvent(td) {
	for (var i = 0; i < 64; i++)
		(function(i) {
			td[i].onclick = function() {
				if (pieces[i].className == 'prompt') chessBoard.toDown(i);
			};
		})(i);
	td = undefined;
}
