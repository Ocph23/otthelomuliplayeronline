angular.module('admin.router', [ 'ui.router' ]).config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('admin');
	$stateProvider
		.state('admin', {
			url: '/admin',
			controller: 'adminController',
			templateUrl: '../apps/views/admin/index.html'
		})
		.state('peraturan', {
			url: '/peraturan',
			controller: 'peraturanController',
			templateUrl: '../apps/views/admin/peraturan.html'
		})
		.state('pemain', {
			url: '/pemain',
			controller: 'playersController',
			templateUrl: '../apps/views/admin/pemain.html'
		})
		.state('tantangan', {
			url: '/tantangan',
			controller: 'tantanganController',
			templateUrl: '../apps/views/admin/tantangan.html'
		});
});
