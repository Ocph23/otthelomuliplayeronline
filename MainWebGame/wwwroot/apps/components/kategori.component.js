angular.module('app.kategori.conponent', []).component('kategori', {
	controller: function($scope, AuthService, KategoriService, kodefikasiService, $rootScope) {
		$scope.kodefikasi = kodefikasiService;

		KategoriService.get().then((x) => {
			$scope.kategories = x;
		});

		$scope.Select = (item) => {
			$rootScope.$broadcast('selectedKategori', item);
		};
	},
	templateUrl: 'apps/js/components/templates/kategori.html'
});
