'use strict';

var app = angular.module('WeNomYou', [
	'ngRoute',
	'ui.bootstrap'
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
		title: 'Register'
	}).when('/login', {
		templateUrl: 'views/login-register.html',
		title: 'Login'
	}).otherwise({
		redirectTo: '/'
	});
});

app.controller('MainCtrl', function($scope, API_URL) {
	$scope.server = API_URL.url;
});