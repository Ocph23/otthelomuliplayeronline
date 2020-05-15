angular.module('app.chat.conponent', []).component('chating', {
	controller: function($scope, AuthService, ChatService, $rootScope) {
		$scope.message = '';
		$scope.isOpened = ChatService.isOpened;
		$scope.channels = [];
		$scope.chats = [];
		setTimeout((x) => {
			if (ChatService.signalR) {
				ChatService.signalR.on('ReceiveMessage', (data) => {
					$scope.$apply((x) => {
						var channel = $scope.channels.find((x) => x.channelId == data.idpengirim);
						if (channel) {
							channel.chats.push(data);
						} else {
							ChatService.getchatwith(data.idpengirim).then((chats) => {
								channel = { isOpened: true, channelId: data.idpengirim, chats: chats };
								channel.chats.push(data);
								$scope.channels.push(channel);
							});
						}
						channel.isOpened = true;
					});
				});

				ChatService.signalR.on('ErrorMessage', (message) => {
					setTimeout((x) => {
						$scope.$apply((x) => {
							var data = {
								tgl_pesan: new Date(),
								isi_pesan: message + ', Pesan Akan Dirikirim ke Inbox',
								error: true
							};

							var channel = $scope.channels.find((x) => x.isOpened);
							if (channel) {
								channel.chats.push(data);
							}
						});
					}, 100);
				});
				AuthService.profile().then((profile) => {
					$scope.profile = profile;
				});
			}
		}, 5000);

		$rootScope.$on('openChat', (e, value) => {
			var channel = $scope.channels.find((x) => x.channelId == channelId);
			if (!channel) {
				ChatService.getchatwith(value).then((chats) => {
					channel = { isOpened: true, channelId: value, chats: chats };
					$scope.channels.push(channel);
				});
			} else {
				channel.isOpened = true;
			}
		});

		$scope.send = (channel, message) => {
			if (message) {
				var data = {
					tgl_pesan: new Date(),
					avatar: $scope.profile.photo,
					idpengirim: $scope.profile.iduser,
					pengirim: $scope.profile.nama,
					idpenerima: channel.channelId,
					isi_pesan: message
				};

				ChatService.post(data).then((result) => {
					channel.chats.push(data);
					$scope.chats.push(result);
					if (ChatService.signalR) {
						ChatService.sendChat(channel.channelId.toString(), result);
					}

					setTimeout((x) => {
						$scope.$apply((x) => {
							$scope.message = ' ';
						});
					}, 100);
				});
			}
		};
	},
	templateUrl: 'apps/js/components/templates/chat.html'
});
