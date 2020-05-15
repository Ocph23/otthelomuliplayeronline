angular.module('app.useronline.conponent', []).component('useronline', {
	bindings: {
		player: '='
	},
	controller: function($scope, $state, PlayerService) {
		$scope.Title = 'Invite';

		$scope.play = () => {
			//$state.go('game-play', { player: $scope.$ctrl.player });

			PlayerService.connection.invoke('InviteOpponent', $scope.$ctrl.player.userId);
			$scope.Title = 'Tunggu ....';
		};
	},
	templateUrl: './apps/components/useronline/useronline.html'
});
