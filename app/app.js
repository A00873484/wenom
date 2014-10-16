'use strict';

var app = angular.module('WeNomYou', [
	'ngRoute'
]);

app.config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider
	.when('/', {
		templateUrl: 'views/index.html',
		controller: 'HomeCtrl'
	});
});

app.controller('MainCtrl', function($scope) {
});