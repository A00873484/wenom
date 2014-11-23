'use strict';

// Enable lines below to override console.log() statements for production
// var console = {};
// console.log = function(){};
var app = angular.module('WeNomYou', [
	'ngRoute',
	'ui.bootstrap',
	'textAngular',
	'angularFileUpload',
	'ngQuickDate',
	'angularMoment',
	'restangular',
	'ipCookie'
]);

app.constant('API_URL', {
	url: 'http://apitest.younom.me',
	loc: '/apiservice.svc/'
});

app.run(function($rootScope, $route, $location, $templateCache) {
	// Disable route caching
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		if (typeof(current) !== 'undefined') {
			$templateCache.remove(current.templateUrl);
		}
	});

	// Handle dynamic URLs via route
	// Set page title depending on whether the route has a title specified
	$rootScope.site_title = 'WeNomYou';
	$rootScope.$on('$routeChangeSuccess', function() {
		$rootScope.page_title = !angular.isUndefined($route.current.title) ? $route.current.title + ' | ' + $rootScope.site_title : $rootScope.site_title;
	});
});

app.config(function($routeProvider, $locationProvider, RestangularProvider, API_URL) {
	$locationProvider.html5Mode(true); 	// Enable HTML5 mode for Angular hashbang-based URL routing
	RestangularProvider.setBaseUrl(API_URL.url + API_URL.loc); // Set base URL for Restangular requests
	$routeProvider
	.when('/', {
		templateUrl: 'views/index.html',
		controller: 'HomeCtrl'
	}).when('/register', {
		templateUrl: 'views/login-register.html',
		title: 'Register'
	}).when('/login', {
		templateUrl: 'views/login-register.html',
		title: 'Login'
	}).when('/start', {
		templateUrl: 'views/create-challenge.html',
		controller: 'CreateChallengeCtrl',
		title: 'Challenge Creation'
	}).when('/continue', {
		templateUrl: 'views/create-challenge.html',
		controller: 'CreateChallengeCtrl',
		title: 'Continue Challenge Creation'
	}).when('/challenge/:challengeid/:challengename?', {
		templateUrl: 'views/challenge.html',
		controller: 'ChallengeCtrl',
		title: 'View Campaign'
	}).when('/profile', {
		templateUrl: 'views/edit-profile.html',
		controller: 'ProfileCtrl',
		title: 'View Campaign'
	}).when('/explore', {
		templateUrl: 'views/explore.html',
		controller: 'ExploreCtrl',
		title: 'Explore Challenges',
		reloadOnSearch: false
	}).when('/admin', {
		templateUrl: 'views/admin.html',
		controller: 'AdminCtrl',
		title: 'Administration',
	}).otherwise({
		redirectTo: '/'
	});
});

app.factory('authHttpInterceptor', function($q, $location, $injector) {
	return {
		// Set auth token for all requests
		request: function(config) {
			var User = $injector.get('UserService');
			if($location.path().split("/")[1] !== 'login')
    			config.headers["X-Auth-Token"] = User.auth_token;
    		return config;
  		},
		// Ensure auth token is still valid
  		responseError: function(response) {
  			var User = $injector.get('UserService');
  			if(response.status === 401 && response.data.code === "invalid_auth_token") {
				User.setLoggedOut();
			}
			return $q.reject(response);
  		}
	};
});

app.controller('MainCtrl', function($scope, API_URL, $rootScope, UserService, $timeout, Restangular, APIAuth) {
	window.user = $rootScope.curruser = $scope.User = UserService;
	$rootScope.challenges = $rootScope.challenges || [];
	// $rootScope.users = $rootScope.users || [];
	// $rootScope.users.push({
	// 	auth_token: "FAKEDATADELETE",
	// 	email: "jay@jayhuang.org",
	// 	first_name: "Jay",
	// 	password: "google",
	// 	password_confirm: "google"
	// });

	// window.a = function() {
	// 	// Send request
	// 	var acc = {"email":"jay@jayhuang.org", "password":"google"};
	// 	Restangular.all('register').post(acc).then(
	// 		function(success) {
	// 			console.log(success.data);
	// 		},
	// 		function(fail) {
	// 			console.log(fail);
	// 		});
	// }

	// window.b = function() {
	// 	APIAuth.getUser().then(function(success) {
	// 		console.log(success);
	// 		window.c = success;
	// 	},
	// 	function(fail) {
	// 		console.log(fail);
	// 	});
	// }
});