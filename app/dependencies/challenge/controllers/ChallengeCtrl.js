app.controller('ChallengeCtrl', function($routeParams, $scope, $rootScope, APIChallenge) {
	// $scope.challenge = $rootScope.challenges[$routeParams.challengeid - 1];
	APIChallenge.getChallenge($routeParams.challengeid).then(function(success) {
		$scope.challenge = success.data;
		$rootScope.page_title = !angular.isUndefined($scope.challenge.name) ? $scope.challenge.name + ' - ' + $rootScope.site_title : $rootScope.site_title;
	}, function(fail) {
		console.log(fail);
	});
});