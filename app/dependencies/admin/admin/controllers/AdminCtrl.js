app.controller('AdminCtrl', function($scope, APIUser) {
	APIUser.getUsers().then(function(success) {
		window.a = $scope.users = success.data;
	}, function(fail) {
		console.log(fail);
	});

	$scope.toggleDisabled = function(user) {
		if(user.disabled) {
			APIUser.enableUser(user.id).then(function(success){
				user.disabled = 0;	
			});
		} else {
			APIUser.disableUser(user.id).then(function(success) {
				user.disabled = 1;
			});
		}
	}

	$scope.delete = function(user) {
		console.log(user.name);
	}
});