app.controller('NavCtrl', function($scope, CreateChallengeService, $location) {
	$scope.campaign = CreateChallengeService;
	$scope.isActive = function (viewLocation) { 
        return $location.path().indexOf(viewLocation) == 0;
    };
});