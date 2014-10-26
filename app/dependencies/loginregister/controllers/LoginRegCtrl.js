app.controller('LoginCtrl', function($scope, UserService, $rootScope, $location) {
	$scope.login = function($event) {
		if(!$scope.formData) UserService.init(); // Cache current data
		$scope.formData = $scope.formData ? $scope.formData : UserService;

		$scope.formData.errors = [];
		if(!$rootScope.users.length) {
			$scope.formData.errors.push({"message":"Please register first"});
			return;
		} else {
			// var user = '';
			$rootScope.users.forEach(function(user) {
				if(user.email == $scope.formData.email && user.password == $scope.formData.password)
					UserService.setLoggedIn(user);
			});
		}

		$scope.formData.errors.push({"message":"Invalid credentials, try again"});
	}
});

app.controller('RegCtrl', function($scope, UserService, $rootScope) {
	$scope.createAccount = function($event) {
		if(!$scope.formData) UserService.init(); // Cache current data
		$scope.formData = $scope.formData ? $scope.formData : UserService;

		$scope.formData = $scope.formData ? $scope.formData : UserService;
		$scope.formData.auth_token = "FAKEDATADELETE";
		$rootScope.users.push(angular.copy($scope.formData));
		$scope.register_form.$setUntouched(); // Don't show any validation errors
		$scope.formData.successful = {"message":"Account created, please login now!"};
		UserService.reset(); // Success, reset the form
	}
});