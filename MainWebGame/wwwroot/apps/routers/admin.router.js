angular.module('admin.router', [ 'ui.router' ]).config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('admin');
	$stateProvider
		.state('admin', {
			url: '/admin',
			controller: 'adminController',
			templateUrl: '../apps/views/admin/index.html'
		})
		.state('admin-home', {
			url: '/home',
			controller: 'adminController',
			parent: 'admin',
			templateUrl: '../apps/views/admin/home.html'
		})
		.state('admin-peraturan', {
			url: '/peraturan',
			parent: 'admin',
			controller: 'peraturanController',
			templateUrl: '../apps/views/admin/peraturan.html'
		})
		.state('admin-pemain', {
			url: '/pemain',
			parent: 'admin',
			controller: 'playersController',
			templateUrl: '../apps/views/admin/pemain.html'
		})
		.state('admin-tantangan', {
			url: '/tantangan',
			parent: 'admin',
			controller: 'tantanganController',
			templateUrl: '../apps/views/admin/tantangan.html'
		});
});
