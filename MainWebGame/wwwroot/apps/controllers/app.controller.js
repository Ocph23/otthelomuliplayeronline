angular
	.module('app.controller', [ 'account.controller' ])
	.controller('gameHomeController', gameHomeController)
	.controller('peringkatController', peringkatController)
	.controller('gameVsComputerController', gameVsComputerController)
	.controller('gamePlayController', gamePlayController);

function gameHomeController($scope, PlayerService, $state, message, AuthService) {
	AuthService.profile().then((x) => {
		$scope.profile = x;
		$scope.photos = x.photo;
	});
	var userId = PlayerService.getMyUserId();
	$scope.userId = PlayerService.getMyUserId();
	$scope.playerService = PlayerService;

	PlayerService.connection.on('Users', (players) => {
		$scope.$apply((x) => {
			PlayerService.players = players.filter((x) => x.userId != userId);
			PlayerService.MyAccount = players.find((x) => x.userId == userId);
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

	PlayerService.connection.on('OnOfflinePlayer', (connectionId) => {
		$scope.$apply((x) => {
			userExist = $scope.playerService.players.find((x) => x.connectionId == connectionId);
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

	if (!PlayerService.connection.connectionStarted) {
		PlayerService.start();
	}

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

function gamePlayController($scope, GameService, $state, $stateParams) {
	if ($stateParams.data) {
		$scope.side1 = $stateParams.data.owner.playerName;
		$scope.side2 = $stateParams.data.opponent.playerName;
		setTimeout(() => {
			GameService.start($stateParams.data);
		}, 500);
	} else {
		$state.go('game-home');
	}

	$scope.AiPlay = () => {
		GameService.AiPlay();
	};
}

function gameVsComputerController($scope, $state, GameService, $state) {
	var playerName = document.getElementById('playerName').value;
	$scope.model = { pion: '1', level: '2' };
	$('#exampleModal').modal('show');

	$scope.start = (params) => {
		if (params.pion == 1) {
			$scope.side1 = playerName;
			$scope.side2 = 'Computer';
		} else {
			$scope.side2 = playerName;
			$scope.side1 = 'Computer';
		}
		GameService.startVsComputer(params);
		$scope.myPlay = GameService.mePlay;
	};

	$scope.cancel = () => {
		setTimeout(() => {
			$state.go('game-home');
		}, 500);
	};

	$scope.AiPlay = () => {
		GameService.AiPlay();
	};

	$scope.resign = () => {
		$state.go('game-home');
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

	function generate(historyMain, id, m) {
		g = document.createElement('div');
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

		side[m.side].className = 'cbox side';
		side[-m.side].className = 'cbox';
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
}

function peringkatController($scope, PlayerService, PeraturanService) {
	$scope.userId = PlayerService.getMyUserId();
	$scope.playerService = PlayerService;

	PeraturanService.getPeringkat().then((x) => {
		$scope.datas = x;
	});
}
