angular.module('app.router', [ 'ui.router', 'account.router' ]).config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/game/home');
	$stateProvider
		.state('game', {
			url: '/game',
			templateUrl: './apps/views/games/index.html'
		})
		.state('game-home', {
			url: '/home',
			parent: 'game',
			controller: 'gameHomeController',
			templateUrl: './apps/views/games/home.html'
		})
		.state('game-vs-ai', {
			url: '/vscomputer',
			parent: 'game',
			params: { roles: null },
			controller: 'gameVsComputerController',
			templateUrl: './apps/views/games/playvscomputer.html'
		})
		.state('game-play', {
			url: '/play',
			parent: 'game',
			params: { data: null },
			controller: 'gamePlayController',
			templateUrl: './apps/views/games/play.html'
		});
});
