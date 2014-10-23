'use strict';

// Enable lines below to override console.log() statements for production
// var console = {};
// console.log = function(){};
var app = angular.module('WeNomYou', [
	'ngRoute',
	'ui.bootstrap',
	'textAngular'
]);

app.constant('API_URL', {
	url:"http://localhost",
	loc: '/api/v1/'
});

app.config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider
	.when('/', {
		templateUrl: 'views/index.html',
		controller: 'HomeCtrl'
	}).when('/register', {
		templateUrl: 'views/login-register.html',
		controller: 'LoginRegCtrl',
		title: 'Register'
	}).when('/start', {
		templateUrl: 'views/create-challenge.html',
		controller: 'CreateChallengeCtrl',
		title: 'Challenge Creation'
	}).when('/continue', {
		templateUrl: 'views/create-challenge.html',
		controller: 'CreateChallengeCtrl',
		title: 'Continue Challenge Creation'
	}).when('/login', {
		templateUrl: 'views/login-register.html',
		title: 'Login'
	}).otherwise({
		redirectTo: '/'
	});
});

app.controller('MainCtrl', function($scope, API_URL) {
	$scope.server = API_URL.url;
});;;;app.controller('CreateChallengeCtrl', function($scope, CreateChallengeService) {
	CreateChallengeService.enforceFormProgress(); // If the user hasn't started the challenge, send them back to the start
	if(!$scope.campaign) CreateChallengeService.init(); // If this controller wasn't called with an existing challenge, cache the current (empty) data
	$scope.campaign = CreateChallengeService;

	$scope.saveData = function($event) {
		console.log(CreateChallengeService);
	}
});;app.service('CreateChallengeService', function($location, $rootScope) {
	var Challenge = {
		id: '',
		status: '',
		name: '',
		description: '',
		nominee: '',
		goal: '0',
		start_date: '',
		duration: '',
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
});;app.controller('HomeCtrl', function($scope) {
	$scope.hi = "Hello";
});;app.controller('LoginRegCtrl', function($scope) {
});;app.service('UserService', function($location, $http, APIRegister, ipCookie, Restangular, $timeout) {
	var User = {
		email: '',
		first_name: '',
		last_name: '',
		auth_token: ''
	}
	
	User.updateUserData = function(data) {
		if (!data) return false;

		copyObjectProperties(data, User);
		ipCookie('wenomyou.user', User, {expires: 239, expirationUnit: 'minutes'}); // Update the cookie data or new User data will be overwritten
	}

	function copyObjectProperties(srcObj, destObj) {
		for(var key in srcObj) {
			destObj[key] = srcObj[key];
		}
	}

	User.isLoggedIn = function() {
		if(!ipCookie('wenomyou.user'))
			return false; // Returning the cookie will cause infinite $digest cycles. Return false if loggedin cookie is gone
		else {
			copyObjectProperties(ipCookie('wenomyou.user'), User); // If the user refreshes the browser, objects in memory are gone. Retrieve data.
		}
		return User.auth_token; // If the cookie exists, make sure the auth token exists too
	}

	User.setLoggedIn = function(data) {
		data = data || ipCookie('wenomyou.user');
		if(!data) return false;

		copyObjectProperties(data, User);
		ipCookie('wenomyou.user', data, {expires: 239, expirationUnit: 'minutes'}); // Server currently sets token expiry to 4 hours, prompt re-log before that
		$location.path('/');
		return true;
	}

	User.setLoggedOut = function() {
		// Log out no matter what the server response is
		Restangular.one('logout').post().finally(function() {
			User.email = '';
			User.first_name = '';
			User.last_name = '';
			User.auth_token = '';
			ipCookie.remove('wenomyou.user');
			$location.path('/login');
		});
	}

	return User;
});