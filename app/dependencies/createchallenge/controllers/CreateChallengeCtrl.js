app.controller('CreateChallengeCtrl', function($scope, CreateChallengeService) {
	CreateChallengeService.enforceFormProgress(); // If the user hasn't started the challenge, send them back to the start
	if(!$scope.campaign) CreateChallengeService.init(); // If this controller wasn't called with an existing challenge, cache the current (empty) data
	$scope.campaign = CreateChallengeService;

	$scope.saveData = function($event) {
		console.log(CreateChallengeService);
	}
});