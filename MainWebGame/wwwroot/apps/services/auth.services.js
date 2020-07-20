angular.module('auth.service', []).factory('AuthService', AuthService);

function AuthService($http, $q, StorageService, $state, helperServices, message) {
	var controller = '/api/user';
	var service = {};

	return {
		Init: InitLoad,
		login: login,
		logOff: logoff,
		userIsLogin: userIsLogin,
		getUserName: getUserName,
		userIsLogin: userIsLogin,
		userInRole: userInRole,
		getHeader: getHeader,
		url: service.url,
		profile: profile,
		register: register,
		getToken: getToken,
		updatePhotoProfile: updatePhotoProfile
	};

	function updatePhotoProfile(userid, data) {
		var def = $q.defer();
		$http({
			method: 'post',
			url: helperServices.url + controller + '/photoprofile/' + userid,
			headers: getHeader(),
			data: data
		}).then(
			(res) => {
				StorageService.addObject('user', res.data);
				def.resolve(res.data);
			},
			(err) => {
				message.error(err);
				def.reject();
			}
		);
		return def.promise;
	}

	function InitLoad(params) {
		var isFound = false;
		params.forEach((x) => {
			if (userInRole(x)) isFound = true;
		});

		if (!isFound) $state.go('login');
		else return isFound;
	}

	function profile() {
		var def = $q.defer();
		var result = StorageService.getObject('user');
		if (result != null) {
			def.resolve(result);
		} else {
			$http({
				method: 'get',
				url: helperServices.url + controller + '/profile',
				headers: getHeader()
			}).then(
				(res) => {
					StorageService.addObject('profile', res.data);
					def.resolve(res.data);
				},
				(err) => {
					message.error(err);
					def.reject();
				}
			);
		}

		return def.promise;
	}

	function login(user) {
		var def = $q.defer();
		$http({
			method: 'post',
			url: helperServices.url + controller + '/login',
			headers: getHeader(),
			data: user
		}).then(
			(res) => {
				StorageService.addObject('user', res.data);
				def.resolve(res.data);
			},
			(err) => {
				message.error(err);
				def.reject();
			}
		);
		return def.promise;
	}

	function register(data) {
		var def = $q.defer();
		$http({
			method: 'post',
			url: helperServices.url + controller + '/register',
			headers: getHeader(),
			data: data
		}).then(
			(res) => {
				message.info('Registrasi Berhasil, Silahkan Login');
				def.resolve(res.data);
			},
			(err) => {
				message.error(err);
				def.reject();
			}
		);
		return def.promise;
	}

	function getHeader() {
		try {
			if (userIsLogin()) {
				return {
					'Content-Type': 'application/json',
					Authorization: 'bearer ' + getToken()
				};
			}
			throw new Error('Not Found Token');
		} catch (err) {
			return {
				'Content-Type': 'application/json'
			};
		}
	}

	function logoff() {
		StorageService.clear();
		$state.go('login');
	}

	function getUserName() {
		if (userIsLogin) {
			var result = StorageService.getObject('user');
			return result.Username;
		}
	}

	function getToken() {
		var result = StorageService.getObject('user');
		return result == null ? null : result.token;
	}

	function userIsLogin() {
		var result = StorageService.getObject('user');
		if (result) {
			return true;
		}
		return false;
	}

	function userInRole(role) {
		var result = StorageService.getObject('user');
		if (result && result.role == role) {
			return true;
		}
		return false;
	}
}
