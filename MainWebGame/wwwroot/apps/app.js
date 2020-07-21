angular
	.module('app', [
		'swangular',
		'app.router',
		'admin.router',
		'app.component',
		'app.controller',
		'admin.controller',
		'account.controller',
		'app.service'
	])
	.config(() => {
		//or as a Number prototype method:
		Number.prototype.padLeft = function(n, str) {
			return Array(n - String(this).length + 1).join(str || '0') + this;
		};
	})
	.controller('homeController', homeController)
	.directive('chooseFile', function($http, helperServices, AuthService) {
		return {
			link: function(scope, elem, attrs) {
				var button = elem.find('img');
				var input = angular.element(elem[0].querySelector('input#file'));
				button.bind('click', function() {
					input[0].click();
				});
				input.bind('change', function(e) {
					scope.$apply(function() {
						var files = e.target.files;
						if (files[0]) {
							var f = files[0];
							//scope.model.fileName = f.name;
							r = new FileReader();
							r.onload = (function(theFile) {
								return function(e) {
									//var binaryData = e.target.result;
									var img = document.createElement('img');
									img.src = e.target.result;
									setTimeout((z) => {
										var canvas = document.createElement('canvas');
										var ctx = canvas.getContext('2d');
										ctx.drawImage(img, 0, 0);

										var MAX_WIDTH = 35;
										var MAX_HEIGHT = 35;
										var width = img.width;
										var height = img.height;

										if (width > height) {
											if (width > MAX_WIDTH) {
												height *= MAX_WIDTH / width;
												width = MAX_WIDTH;
											}
										} else {
											if (height > MAX_HEIGHT) {
												width *= MAX_HEIGHT / height;
												height = MAX_HEIGHT;
											}
										}
										canvas.width = width;
										canvas.height = height;
										var ctx = canvas.getContext('2d');
										ctx.drawImage(img, 0, 0, width, height);

										dataurl = canvas.toDataURL(f.type);
										//document.getElementById('output').src = dataurl;

										var parts = dataurl.split(';base64,');
										var contentType = parts[0].split(':')[1];
										var raw = window.atob(parts[1]);
										//Converting Binary Data to base 64
										var base64String = window.btoa(raw);
										var model = input[0].attributes[1];
										//Reflect.defineProperty(scope.model, model.value, base64String);
										//scope.photos = base64String;
										setTimeout(() => {
											scope.$apply(function() {
												scope.photos = 'data:image/png;base64,' + base64String;
												$http({
													method: 'post',
													url: helperServices.url + '/api/user/photo',
													headers: AuthService.getHeader(),
													data: { IdUser: scope.userId, photo: base64String }
												}).then(
													(res) => {
														//def.resolve(res.data);
														//message.info('Photo Profile Berhasil Diubah');
													},
													(err) => {
														//message.error(err);
														//def.reject();
													}
												);
											});
										}, 200);
									}, 200);
								};
							})(f);
							r.readAsDataURL(f);
						} else {
							scope.model.gambar = null;
						}
					});
				});
			}
		};
	});

function homeController($scope, AuthService) {
	$scope.logOff = function() {
		AuthService.logOff();
	};
}
