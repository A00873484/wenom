app.service('CreateChallengeService', function($location, $rootScope) {
	var Challenge = {
		id: '',
		status: '',
		name: '',
		picture: '',
		created: '',
		description: '',
		nominee: '',
		goal: '0',
		funded_amount: '0',
		start_date: '',
		challenge_length: '',
		end_date: '',

		// Caches the properties of the object so we can reset it later
		init: function() {
			var origVals = {};
			for(var prop in this) {
				if(this.hasOwnProperty(prop) && prop != "origVals") {
					origVals[prop] = this[prop];
				}
			}
			this.origVals = origVals;
		},

		// Reset the properties of the object to the previously cached values
		reset: function() {
			for(var prop in this.origVals) {
				this[prop] = this.origVals[prop];
			}
		}
	}

	// Check if the user is at the right place in the form; if not, send them back
	Challenge.enforceFormProgress = function() {
		$rootScope.currentUrl = $location.path();
		maybeBackToStart();
		$rootScope.$on("$locationChangeStart", function(event, next, current) {
			maybeBackToStart();
		});

		function maybeBackToStart() {
			if(!Challenge.id && $rootScope.currentUrl != '/start') {
				$location.path('start');
			}
		}
	}

	return Challenge;
});