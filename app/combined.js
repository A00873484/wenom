/*
 * WeNomYou
 * Project dependencies for the WeNomYou project
 * @author Jay Huang, Daniel Engelhard, Enoch Yip
 * @version 0.0.0
 * License: BSD-2-Clause
 */

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
		controller: 'LoginRegCtrl',
		title: 'Register'
	}).when('/start', {
		templateUrl: 'views/create-challenge.html',
		controller: 'CreateChallengeCtrl',
		title: 'Challenge Creation'
	}).when('/continue', {
		templateUrl: 'views/continue-challenge.html',
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
});;app.controller('CreateChallengeCtrl', function($scope) {
});;app.controller('HomeCtrl', function($scope) {
	$scope.hi = "Hello";
});;app.controller('LoginRegCtrl', function($scope) {
});