app.controller('ChallengeCtrl', function($routeParams, $scope, $rootScope) {
	$routeParams;
	$scope.challenge = $rootScope.challenges[$routeParams.challengeid - 1];
});