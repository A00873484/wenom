app.controller('ChallengeCtrl', function($routeParams, $scope, $rootScope, APIChallenge, APIUser) {
	$scope.pledged = false;
	// $scope.challenge = $rootScope.challenges[$routeParams.challengeid - 1];
	APIChallenge.getChallenge($routeParams.challengeid).then(function(success) {
		window.a = $scope.challenge = success.data;
		$rootScope.page_title = !angular.isUndefined($scope.challenge.name) ? $scope.challenge.name + ' - ' + $rootScope.site_title : $rootScope.site_title;
		initAuthor();
		updatePledges();
	}, function(fail) {
		console.log(fail);
	});

	function initAuthor() {
		APIUser.getUser($scope.challenge.nominator).then(function(success) {
			$scope.nominator = success.data;
		});
	}

	function updatePledges() {
		APIChallenge.getChallengePledges($scope.challenge.id).then(function(success) {
			$scope.pledges = success.data;
		});
	}

	$scope.dateInPast = function(value) {
		return moment(value) < moment(new Date());
	}

	$scope.pledge = function(id, amount) {
		if(id && amount) {
			APIChallenge.pledge(id, amount).then(function(success) {
				console.log(success.data);
				$scope.challenge.funded_amount += +amount;
				$scope.pledged = true;
				updatePledges();
			});
		}
	}
});