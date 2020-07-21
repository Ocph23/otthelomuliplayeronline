angular.module('app.useronline.conponent', []).component('useronline', {
	bindings: {
		player: '='
	},
	controller: function($scope, $state, PlayerService) {
		$scope.Title = 'Invite';

		$scope.play = () => {
			//$state.go('game-play', { player: $scope.$ctrl.player });

			PlayerService.connection.invoke('InviteOpponent', $scope.$ctrl.player.userId);

			//OnRejectInvite
			PlayerService.connection.on('OnRejectInvite', (param) => {
				if ($scope.$ctrl.player.userId == param) {
					$scope.$apply((x) => {
						$scope.Title = 'Ditolak';
						setTimeout((x) => {
							$scope.$apply((x) => {
								$scope.Title = 'Invite';
							});
						}, 2000);
					});
				}
			});
			$scope.Title = 'Tunggu ....';
		};
	},
	templateUrl: './apps/components/useronline/useronline.html'
});
