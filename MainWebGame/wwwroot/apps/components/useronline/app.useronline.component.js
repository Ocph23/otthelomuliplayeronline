angular.module('app.useronline.conponent', []).component('useronline', {
	bindings: {
		player: '='
	},
	controller: function($scope, $state, PlayerService, helperServices) {
		$scope.Title = 'Invite';
		setTimeout(() => {
			if (!$scope.$ctrl.player.photo)
				$scope.$apply((x) => {
					$scope.$ctrl.player.photo = helperServices.url + '/images/noimage.png';
				});
			else {
				$scope.$ctrl.player.photo = 'data:image/png;base64,' + $scope.$ctrl.player.photo;
			}
		}, 500);

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
