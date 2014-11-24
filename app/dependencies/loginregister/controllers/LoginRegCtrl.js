app.controller('LoginCtrl', function($scope, UserService, $rootScope, $location, APIAuth) {
	$scope.login = function($event) {
		if(!$scope.formData) UserService.init(); // Cache current data
		$scope.formData = $scope.formData ? $scope.formData : UserService;

		$scope.formData.errors = [];
		// if(!$rootScope.users.length) {
		// 	$scope.formData.errors.push({"message":"Please register first"});
		// 	return;
		// } else {
		// 	$rootScope.users.forEach(function(user) {
		// 		if(user.email == $scope.formData.email && user.password == $scope.formData.password)
		// 			UserService.setLoggedIn(user);
		// 	});
		// }

		APIAuth.login($scope.formData).then(function(success) {
			UserService.setLoggedIn(success.data);
		}, function(fail) {
			console.log(fail.data);
			$scope.formData.errors.push({"message":"Invalid credentials, try again"});
		});

		// $scope.formData.errors.push({"message":"Invalid credentials, try again"});
	}
});

app.controller('RegCtrl', function($scope, UserService, $rootScope, APIAuth) {
	$scope.createAccount = function($event) {
		if(!$scope.formData) UserService.init(); // Cache current data
		$scope.formData = $scope.formData ? $scope.formData : UserService;
		APIAuth.register($scope.formData).then(function(success) {
			// console.log(success.data);
			$scope.formData.successful = {"message":"Account created, please login now!"};
		}, function(fail) {
			console.log(fail.data);
		});
		// $scope.formData.auth_token = "FAKEDATADELETE";
		// $rootScope.users.push(angular.copy($scope.formData));
		$scope.register_form.$setUntouched(); // Don't show any validation errors
		UserService.reset(); // Success, reset the form
	}
});