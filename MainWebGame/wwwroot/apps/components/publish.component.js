angular.module('app.publish.conponent', []).component('publish', {
	bindings: { value: '<' },
	controller: function($scope, AuthService) {
		$scope.publish = '';
		setTimeout((x) => {
			$scope.$apply((x) => {
				$scope.publish = timeSince(new Date($scope.$ctrl.value));
			});
		}, 200);

		function timeSince(time) {
			switch (typeof time) {
				case 'number':
					break;
				case 'string':
					time = +new Date(time);
					break;
				case 'object':
					if (time.constructor === Date) time = time.getTime();
					break;
				default:
					time = +new Date();
			}
			var time_formats = [
				[ 60, 'detik', 1 ], // 60
				[ 120, '1 menit lalu', '1 menit lagi' ], // 60*2
				[ 3600, 'menit', 60 ], // 60*60, 60
				[ 7200, '1 jam lalu', '1 jam lagi' ], // 60*60*2
				[ 86400, 'jam', 3600 ], // 60*60*24, 60*60
				[ 172800, '1 hari lalu', 'sehari lagi' ], // 60*60*24*2
				[ 604800, 'hari', 86400 ], // 60*60*24*7, 60*60*24
				[ 1209600, '1 minggu lalu', 'seminggu lagi' ], // 60*60*24*7*4*2
				[ 2419200, 'minggu', 604800 ], // 60*60*24*7*4, 60*60*24*7
				[ 4838400, '1 bulan lalu', 'sebulan lagi' ], // 60*60*24*7*4*2
				[ 29030400, 'bulan', 2419200 ], // 60*60*24*7*4*12, 60*60*24*7*4
				[ 58060800, '1 tahun lalu', 'setahun lagi' ], // 60*60*24*7*4*12*2
				[ 2903040000, 'tahun', 29030400 ], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
				[ 5806080000, '1 abad lalu', 'seabad lagi' ], // 60*60*24*7*4*12*100*2
				[ 58060800000, 'abad', 2903040000 ] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
			];
			var seconds = (+new Date() - time) / 1000,
				token = 'lalu',
				list_choice = 1;

			if (seconds == 0) {
				return 'sekarang';
			}
			if (seconds < 0) {
				seconds = Math.abs(seconds);
				token = 'dari sekarang';
				list_choice = 2;
			}
			var i = 0,
				format;
			while ((format = time_formats[i++]))
				if (seconds < format[0]) {
					if (typeof format[2] == 'string') return format[list_choice];
					else return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
				}
			return time;
		}
	},
	template: '<span>{{publish}}</span>'
});
