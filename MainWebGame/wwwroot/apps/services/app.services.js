angular
	.module('app.service', [ 'message.service', 'auth.service', 'storage.services', 'helper.service', 'data.service' ])
	.controller('homeController', homeController);
