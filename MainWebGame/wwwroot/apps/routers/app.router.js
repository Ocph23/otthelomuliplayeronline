angular.module('app.router', [ 'ui.router', 'admin.router' ]).config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/game/home');
	$stateProvider
		.state('player', {
            url: '/game',
            controller: 'gameController',
			templateUrl: './apps/views/games/index.html'
		})
		.state('player-home', {
			url: '/home',
			parent: 'player',
			controller: 'gameHomeController',
			templateUrl: './apps/views/games/home.html'
		})
		.state('game-peringkat', {
			url: '/peringkat',
			parent: 'player',
			controller: 'peringkatController',
			templateUrl: './apps/views/games/peringkat.html'
		})
		.state('game-profile', {
			url: '/profile',
			parent: 'player',
			controller: 'profileController',
			templateUrl: './apps/views/games/profile.html'
		})
		.state('game-aturan', {
			url: '/aturan',
			parent: 'player',
			controller: 'aturanController',
			templateUrl: './apps/views/games/aturan.html'
		})
		.state('game-vs-ai', {
			url: '/vscomputer',
			parent: 'player',
			params: { roles: null },
			controller: 'gameVsComputerController',
			templateUrl: './apps/views/games/playvscomputer.html'
		})
		.state('game-play', {
			url: '/play',
			parent: 'player',
			params: { data: null },
			controller: 'gamePlayController',
			templateUrl: './apps/views/games/play.html'
		})
		.state('account', {
			url: '/account',
			templateUrl: './apps/views/accounts/index.html'
		})
		.state('register', {
			url: '/register',
			parent: 'account',
			controller: 'RegisterController',
			templateUrl: './apps/views/accounts/register.html'
		})
		.state('login', {
			url: '/login',
			parent: 'account',
			controller: 'LoginController',
			templateUrl: './apps/views/accounts/signin.html'
		});
});
