angular
	.module('account.controller', [])
	.controller('LoginController', LoginController)
	.controller('RegisterController', RegisterController);

function LoginController($scope, $state, AuthService, $stateParams, message) {
	if ($stateParams.username) {
		setTimeout((x) => {
			$scope.model = { username: '', password: '' };
			$scope.model.username = $stateParams.username;
		}, 2000);
	}
	AuthService.profile().then(
		(x) => {
			if (x) {
				$state.go(x.role.toLowerCase() + '-home');
			}
		},
		(err) => {}
	);

	$scope.login = function(user) {
		AuthService.login(user).then((x) => {
			$state.go(x.role.toLowerCase() + '-home');
		});
	};
}

function RegisterController($scope, $state, AuthService, helperServices, message) {
	$scope.model = {};
	$scope.model.photox = helperServices.url + '/images/noimage.png';
	$scope.register = function(user) {
		if (user.photox) {
			user.photo = user.photox.split(',')[1];
		}
		if (user.password != user.confirmPassword) {
			message.error('Password Tidak Sama');
		} else
			AuthService.register(user).then((x) => {
				$state.go('login', { username: user.userName });
			});
	};
}
