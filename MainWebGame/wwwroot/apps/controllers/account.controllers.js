angular
	.module('account.controller', [])
	.controller('LoginController', LoginController)
	.controller('RegisterController', RegisterController);

function LoginController($scope, $state, AuthService) {
	$scope.login = function(user) {
		AuthService.login(user).then((x) => {
			$state.go(x.role.toLowerCase() + '-home');
		});
	};
}

function RegisterController($scope, $state, AuthService) {
	$scope.register = function(user) {
		AuthService.register(user).then((x) => {
			$state.go(x.role + '-home');
		});
	};
}
