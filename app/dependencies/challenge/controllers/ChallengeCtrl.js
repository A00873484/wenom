app.controller('ChallengeCtrl', function($routeParams, $scope, $rootScope, APIChallenge, APIUser) {
	// $scope.challenge = $rootScope.challenges[$routeParams.challengeid - 1];
	APIChallenge.getChallenge($routeParams.challengeid).then(function(success) {
		window.b = $scope.challenge = success.data;
		$scope.challenge.ends = "12/6/2013 9:36:30 PM";
		$rootScope.page_title = !angular.isUndefined($scope.challenge.name) ? $scope.challenge.name + ' - ' + $rootScope.site_title : $rootScope.site_title;
		APIUser.getUser($scope.challenge.nominator).then(function(success) {
			$scope.nominator = success.data;
		});
	}, function(fail) {
		console.log(fail);
	});

	$scope.dateInPast = function(value) {
		return moment(value) < moment(new Date());
	}
});