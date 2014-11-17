app.controller('ChallengeCtrl', function($routeParams, $scope, $rootScope) {
	$scope.challenge = $rootScope.challenges[$routeParams.challengeid - 1];
	$rootScope.page_title = !angular.isUndefined($scope.challenge.name) ? $scope.challenge.name + ' - ' + $rootScope.site_title : $rootScope.site_title;
});