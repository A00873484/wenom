app.controller('CreateChallengeCtrl', function($scope, CreateChallengeService, APIAuth, $timeout, $rootScope, APIChallenge) {
	// CreateChallengeService.enforceFormProgress(); // If the user hasn't started the challenge, send them back to the start
	if(!$scope.challenge) CreateChallengeService.init(); // If this controller wasn't called with an existing challenge, cache the current (empty) data
	$scope.challenge = CreateChallengeService;

	// if($rootScope.challenges.length) {
	// 	$scope.challenge.id = parseInt($rootScope.challenges[$rootScope.challenges.length - 1].id) + 1;
	// }

	$scope.momentAdd = function(value, add, unit, format) {
		add = add || 0;
		unit = unit || 'days';
		format = format || "MMM DD YYYY";
		return moment(value).add(add, unit).format(format);
	}

	$scope.saveData = function($event) {
		var invalid_elements = $('form, ng-form').find('.ng-invalid,.has-error');
		if (invalid_elements.length > 0) {
			if($event) {
				$event.preventDefault();
				$event.stopPropagation();
			}
			return;
		}

		APIChallenge.createChallenge($scope.challenge);
		// $rootScope.challenges.push(angular.copy($scope.challenge));
	}

	$scope.onFileSelect = function($files) {
		$scope.selectedFiles = [];
		$scope.dataUrls = [];
		for (var i = 0; i < $files.length; i++) {
			var $file = $files[i];
			if ($file.type.indexOf('image') > -1) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL($files[i]);
				var loadFilePreview = function(fileReader, index) {
					fileReader.onload = function(e) {
						$timeout(function() {
							$scope.challenge.picture = $scope.dataUrls[index] = e.target.result;
						});
					}
				}(fileReader, i);
			}
		}
	}

	$scope.noPastDates = function(d) {
		var today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		today.setMilliseconds(0);
		return (d >= today);
	}
});