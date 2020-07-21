angular.module('app.aturan.conponent', []).component('aturan', {
	controller: function($scope, PeraturanService) {
		PeraturanService.get().then((x) => {
			$scope.datas = x;
			$scope.show = true;
		});
	},
	templateUrl: 'apps/components/aturan.html'
});
