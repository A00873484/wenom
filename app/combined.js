/*
 * WeNomYou
 * Project dependencies for the WeNomYou project
 * @author Jay Huang, Daniel Engelhard, Enoch Yip
 * @version 0.0.0
 * License: BSD-2-Clause
 */

/*
 * WeNomYou
 * Project dependencies for the WeNomYou project
 * @author Jay Huang, Daniel Engelhard, Enoch Yip
 * @version 0.0.0
 * License: BSD-2-Clause
 */

/*
 * WeNomYou
 * Project dependencies for the WeNomYou project
 * @author Jay Huang, Daniel Engelhard, Enoch Yip
 * @version 0.0.0
 * License: BSD-2-Clause
 */

/*
 * WeNomYou
 * Project dependencies for the WeNomYou project
 * @author Jay Huang, Daniel Engelhard, Enoch Yip
 * @version 0.0.0
 * License: BSD-2-Clause
 */

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
});;app.controller('HomeCtrl', function($scope) {
	$scope.hi = "Hello";
});