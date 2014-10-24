app.controller('CreateChallengeCtrl', function($scope, CreateChallengeService, API_URL, $upload) {
	CreateChallengeService.enforceFormProgress(); // If the user hasn't started the challenge, send them back to the start
	if(!$scope.campaign) CreateChallengeService.init(); // If this controller wasn't called with an existing challenge, cache the current (empty) data
	$scope.campaign = CreateChallengeService;

	$scope.saveData = function($event) {
		console.log(CreateChallengeService);
	}

	$scope.onFileSelect = function($files) {
		for (var i = 0; i < $files.length; i++) {
			var file = $files[i];
			$scope.upload = $upload.upload({
				url: API_URL.url + API_URL.loc + 'upload/',
				data: {},
		        file: file,
		    }).progress(function(evt) {
		    	console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
		    }).success(function(data, status, headers, config) {
		    	console.log(data);
		    });
		}
	};

	$scope.noPastDates = function(d) {
		var today = new Date();

		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		today.setMilliseconds(0);

		return (d >= today);
	};
});