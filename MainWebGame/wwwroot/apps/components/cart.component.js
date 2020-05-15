angular.module('app.cart.conponent', []).component('cart', {
	controller: function($scope, $state, AuthService, PembeliCartService, message) {
		$scope.source = PembeliCartService.get();

		$scope.add = (item) => {
			PembeliCartService.ad(item);
		};

		$scope.delete = (item) => {
			PembeliCartService.delete(item);
		};

		$scope.lanjut = () => {
			if (AuthService.userIsLogin()) {
				var datas = $scope.source.filter((x) => x.checked);
				$state.go('pembeli-order', { data: datas });
			} else {
				message.error('Anda Belum Login !');
				$state.go('login');
			}
		};

		$scope.Up = (item) => {
			item.jumlah++;
		};
		$scope.Down = (item) => {
			item.jumlah--;
		};

		$scope.hitung = (item) => {
			PembeliCartService.saveCart();
			return item.jumlah * item.harga;
		};

		$scope.total = () => {
			return $scope.source.reduce((total, item) => {
				return total + item.jumlah * item.harga;
			}, 0);
		};
	},
	templateUrl: 'apps/js/components/templates/cart.html'
});
