angular
	.module('app.controller', [ 'account.controller' ])
	.controller('gameHomeController', gameHomeController)
	.controller('gameVsComputerController', gameVsComputerController)
	.controller('gamePlayController', gamePlayController);

function gameHomeController($scope, PlayerService, $state) {
	var userId = PlayerService.getMyUserId();
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
}
