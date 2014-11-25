'use strict';

var holdconsole = console;
function debug(bool){
    if(!bool){
        holdconsole = console;
        console = {};
        console.log = function(){};
    } else
        console = holdconsole;
}

debug(false);

var app = angular.module('WeNomYou', [
	'ngRoute',
	'ui.bootstrap',
	'textAngular',
	'angularFileUpload',
	'ngQuickDate',
	'angularMoment',
	'restangular',
	'ipCookie',
	'angular-loading-bar'
]);

app.constant('API_URL', {
	url: 'http://apitest.younom.me',
	loc: '/apiservice.svc/'
});

app.constant('USER_ROLES', {
	user: '0',
	admin: '1'
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

app.config(function($routeProvider, $httpProvider, $locationProvider, RestangularProvider, API_URL) {
	$httpProvider.interceptors.push('authHttpInterceptor');
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

app.controller('MainCtrl', function($scope, API_URL, $rootScope, $location, UserService, $timeout, Restangular, APIAuth, USER_ROLES) {
	$rootScope.curruser = $scope.User = UserService;
	$rootScope.challenges = $rootScope.challenges || [];

	$scope.$watch(function() {
		return $location.path();
	}, function(newValue, oldValue) {
		if (!UserService.isLoggedIn()) {
			if(newValue.split("/")[1] != "login" && newValue.split("/")[1] != "register" && newValue.split("/")[1] != "explore" && newValue.split("/")[1] != "challenge") {
				$location.path('/login');
			}
		} else {
			if(newValue.split("/")[1] == "admin" && $rootScope.curruser.user_level != USER_ROLES.admin) { // Make sure admin-only pages are off-limits to others
				$location.path('/');
			}

			if(newValue.split("/")[1] == "login" || newValue.split("/")[1] == "register") {
				$location.path('/');
			}
		}
	});
});