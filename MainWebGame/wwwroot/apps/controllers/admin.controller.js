angular
	.module('admin.controller', [])
	.controller('adminController', adminController)
	.controller('peraturanController', peraturanController)
	.controller('tantanganController', tantanganController)
	.controller('playersController', playersController);

function adminController($scope) {}

function peraturanController($scope, PeraturanService, message) {
	$scope.model = {};
	PeraturanService.get().then((x) => {
		$scope.datas = x;
	});

	$scope.selectItem = (model) => {
		$scope.model = angular.copy(model);
	};

	$scope.save = (model) => {
		if (!model.idPeraturan) {
			PeraturanService.post(model).then((x) => {});
		} else {
			PeraturanService.put(model).then((x) => {});
		}
        $('#myModal').modal('hide');
        $scope.model = {};
	};

	$scope.delete = (item) => {
		message.dialog('Yakin Hapus User ?').then((x) => {
			PeraturanService.delete(item.idPeraturan).then((x) => {});
		});
	};
}

function playersController($scope, PeraturanService, message) {
	$scope.model = {};
	PeraturanService.getPemain().then((x) => {
		$scope.datas = x;
	});

	$scope.delete = (item) => {
		message.dialog('Yakin Hapus User ?').then((x) => {
			PeraturanService.deletePemain(item).then((x) => {});
		});
	};
}

function tantanganController($scope, PeraturanService) {
	PeraturanService.getTantangan().then((x) => {
		$scope.datas = x;
	});
}
