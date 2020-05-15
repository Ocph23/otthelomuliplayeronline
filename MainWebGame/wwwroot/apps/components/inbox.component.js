angular.module('app.inbox.conponent', []).component('inbox', {
	controller: function($scope, AuthService) {
		$scope.isLogin = AuthService.userIsLogin();
		if ($scope.isLogin) {
			AuthService.profile().then((profile) => {
				$scope.profile = profile;
			});
		}
		$scope.logoff = function() {
			AuthService.logOff();
		};
	},
	templateUrl: 'apps/js/components/templates/inbox.html'
});
