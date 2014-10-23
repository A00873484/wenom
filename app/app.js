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
});