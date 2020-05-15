angular.module('account.router', [ 'ui.router' ]).config(function($stateProvider, $urlRouterProvider) {
	//$urlRouterProvider.otherwise('/account/login');
	$stateProvider
		.state('account', {
			url: '/account',
			templateUrl: './views/accounts/index.html'
		})
		.state('login', {
			url: '/login',
			parent: 'account',
			controller: 'LoginController',
			templateUrl: './views/accounts/signin.html'
		});
});
