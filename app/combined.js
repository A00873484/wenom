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
		title: 'Explore Challenges'
	}).otherwise({
		redirectTo: '/'
	});
});

// set Restangular to use setFullResponse on specific services (to read headers)
app.factory('RestFullResponse', function(Restangular) {
	return Restangular.withConfig(function(RestangularConfigurer) {
    	RestangularConfigurer.setFullResponse(true);
	});
});

app.controller('MainCtrl', function($scope, API_URL, $rootScope, UserService, $timeout, Restangular, APIAuth) {
	$scope.User = UserService;
	$rootScope.challenges = $rootScope.challenges || [];
	$rootScope.users = $rootScope.users || [];
	$rootScope.users.push({
		auth_token: "FAKEDATADELETE",
		email: "jay@jayhuang.org",
		first_name: "Jay",
		password: "google",
		password_confirm: "google"
	});

	window.a = function() {
		// Send request
		var acc = {"email":"jay@jayhuang.org", "password":"google"};
		Restangular.all('register').post(acc).then(
			function(success) {
				console.log(success.data);
			},
			function(fail) {
				console.log(fail);
			});
	}

	// window.b = function() {
	// 	APIAuth.getUser().then(function(success) {
	// 		console.log(success);
	// 		window.c = success;
	// 	},
	// 	function(fail) {
	// 		console.log(fail);
	// 	});
	// }
});;app.factory('APIAuth', function(Restangular) {
	return {
		// Get users
		getUser: function(userid) {
			return Restangular.all('getUsers').getList();
		},

		// Register user, takes:
		// firstname
		// lastname
		// email
		// password
		register: function(userObj) {
			return Restangular.one('register').customPOST(userObj);
		},

		// Login user, takes:
		// email
		// password
		login: function(credsObj) {
			return Restangular.one('login').customPOST(credsObj);
		}
	}
});;app.controller('ChallengeCtrl', function($routeParams, $scope, $rootScope) {
	$scope.challenge = $rootScope.challenges[$routeParams.challengeid - 1];
	$rootScope.page_title = !angular.isUndefined($scope.challenge.name) ? $scope.challenge.name + ' - ' + $rootScope.site_title : $rootScope.site_title;
});;app.controller('CreateChallengeCtrl', function($scope, CreateChallengeService, APIAuth, $timeout, $rootScope) {
	// CreateChallengeService.enforceFormProgress(); // If the user hasn't started the challenge, send them back to the start
	if(!$scope.challenge) CreateChallengeService.init(); // If this controller wasn't called with an existing challenge, cache the current (empty) data
	$scope.challenge = CreateChallengeService;

	if($rootScope.challenges.length) {
		$scope.challenge.id = parseInt($rootScope.challenges[$rootScope.challenges.length - 1].id) + 1;
	}

	$scope.momentAdd = function(value, add, unit, format) {
		add = add || 0;
		unit = unit || 'days';
		format = format || "MMM DD YYYY";
		return moment(value).add(add, unit).format(format);
	}

	$scope.saveData = function($event) {
		var invalid_elements = $('form, ng-form').find('.ng-invalid,.has-error');
		if (invalid_elements.length > 0) {
			if($event) {
				$event.preventDefault();
				$event.stopPropagation();
			}
			return;
		}
		$rootScope.challenges.push(angular.copy($scope.challenge));
	}

	$scope.onFileSelect = function($files) {
		$scope.selectedFiles = [];
		$scope.dataUrls = [];
		for (var i = 0; i < $files.length; i++) {
			var $file = $files[i];
			if ($file.type.indexOf('image') > -1) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL($files[i]);
				var loadFilePreview = function(fileReader, index) {
					fileReader.onload = function(e) {
						$timeout(function() {
							$scope.challenge.image = $scope.dataUrls[index] = e.target.result;
						});
					}
				}(fileReader, i);
			}
		}
	}

	$scope.noPastDates = function(d) {
		var today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		today.setMilliseconds(0);
		return (d >= today);
	}
});;app.service('CreateChallengeService', function($location, $rootScope) {
	var Challenge = {
		id: '',
		status: '',
		name: '',
		image: '',
		created: '',
		description: '',
		nominee: '',
		goal: '0',
		url: 'http://techpro.local/challenge/',
		funded_amount: '0',
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
});;// Limits the input field to only contain numbers. If anything else is input, it will be removed.
app.directive('numbersOnly', function(){
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl) {
			modelCtrl.$parsers.push(function (inputValue) {
	           	// this next if is necessary for when using ng-required on your input. 
	           	// In such cases, when a letter is typed first, this parser will be called
	           	// again, and the 2nd time, the value will be undefined
	           	if (inputValue == undefined) return '';
	           	var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
	           	if (transformedInput != inputValue) {
		           	modelCtrl.$setViewValue(transformedInput);
		           	modelCtrl.$render();
	           	}         
	           	return transformedInput;         
       		});
		}
	};
});

// Same as numbersOnly directive, but also limits the number to up to 365 only. If it's any more, set to 365
app.directive('365Only', function(){
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl) {
			modelCtrl.$parsers.push(function (inputValue) {
	           	// this next if is necessary for when using ng-required on your input. 
	           	// In such cases, when a letter is typed first, this parser will be called
	           	// again, and the 2nd time, the value will be undefined
	           	if (inputValue == undefined) return '';
	           	var transformedInput = (inputValue.replace(/[^0-9]/g, '') > 365) ? "365" : inputValue.replace(/[^0-9]/g, '');
	           	if (transformedInput != inputValue) {
		           	modelCtrl.$setViewValue(transformedInput);
		           	modelCtrl.$render();
	           	}         
	           	return transformedInput;         
       		});
		}
	};
});

// On button click, check if the nearest form has any fields that are invalid, then scrolls and focuses the first of those fields
app.directive('accessibleForm', function () {
    return {
        scope: true,
        link: function (scope, element, attrs) {
            var form = scope[attrs.name];

            element.bind('click', function(event) {
                var field = null;
                for (field in form) {
                    if (form[field].hasOwnProperty('$pristine') && form[field].$pristine) {
                        form[field].$dirty = true;
                    }
                }

                var invalid_elements = $('form, ng-form').find('.ng-invalid,.has-error');
                if (invalid_elements.length > 0) {
                	// element.attr('disabled', true);
	                $('html,body').animate({scrollTop: $(invalid_elements[0]).offset().top}, 500, function() {
	                   invalid_elements[0].focus();
	                });
                }
            });
        }
    };
});

// Dropdown directive for SemanticUI dropdowns
app.directive('dropdown', function ($timeout) {
	return {
		restrict: "C",
		link: function (scope, elm, attr) {
			$timeout(function () {
				$(elm).dropdown({debug: false}).dropdown('setting', {
					onChange: function (value) {
						scope.$parent[attr.ngModel] = value;
						scope.$parent.$apply();
					}
				});
			}, 0);
		}
	};
});

// Match directive, sets $error.match validity based on whether it matches a model
app.directive('match', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            match: '='
        },
        link: function(scope, elem, attrs, ctrl) {
            scope.$watch('match', function(pass){
                ctrl.$validate();
            });
            ctrl.$validators.match = function(modelValue){
                return (ctrl.$pristine && (angular.isUndefined(modelValue) || modelValue === "")) || modelValue === scope.match;
            };
        }
    };
});

app.filter('noFractionCurrency',
	['$filter', '$locale',
	function(filter, locale) {
		var currencyFilter = filter('currency');
		var formats = locale.NUMBER_FORMATS;
		return function(amount, currencySymbol) {
			var value = currencyFilter(amount, currencySymbol);
			if(value) {
				var sep = value.indexOf(formats.DECIMAL_SEP);
				if(amount >= 0) { 
					return value.substring(0, sep);
				}
				return value.substring(0, sep) + ')';
			} else {
				return amount;
			}
		};
	}]
);

app.filter('formatDate', function() {
	return function(input, formatting) {
		return moment(input).format(formatting);
	}
});;app.controller('ExploreCtrl', function($scope, $routeParams, $location, Restangular, $rootScope, API_URL){
	$scope.sortOrFilters = {
		"sort": '',
		"filters": {
			"category": {},
			"location": '',
			"title": ''
		},
		"page_entries": 30,
		"page_limit": 100,
		"pagination": {},
		"page": null
	}
	var serverurl = 'http://techpro.local/';
	// Temporary placeholders for challenge display, replace with data from API
	var placeholderchallenges = [
		{
			id: '1',
			name: 'ALS ice bucket challenge',
			created: 'Sat Oct 25 2014 00:55:23 GMT-0700 (Pacific Daylight Time)',
			image: '',
			url: serverurl + 'challenge/',
			description: "Dump ice on yourself and pretend you're making a positive impact.",
			funded_amount: '19',
			goal: '50'
		},
		{
			id: '2',
			name: 'Swim in a volcano',
			created: 'Wed Oct 29 2014 00:55:23 GMT-0700 (Pacific Daylight Time)',
			image: '',
			url: serverurl + 'challenge/',
			description: 'Self explanatory.',
			funded_amount: '50000',
			goal: '30000000'
		},
		{
			id: '3',
			name: 'Ask a white girl to coffee!!!',
			created: 'Fri Oct 24 2014 00:55:23 GMT-0700 (Pacific Daylight Time)',
			image: '',
			url: serverurl + 'challenge/',
			description: '2T? (;',
			funded_amount: '880000',
			goal: '1000000'
		},
		{
			id: '4',
			name: 'Super cool challenge',
			created: 'Wed Oct 15 2014 00:55:23 GMT-0700 (Pacific Daylight Time)',
			image: '',
			url: serverurl + 'challenge/',
			description: "",
			funded_amount: '5',
			goal: '99'
		},
	];

	if($rootScope.challenges.length <= 1) {
		placeholderchallenges.forEach(function(challenge) {
			$rootScope.challenges.push(challenge);
		});
	}

	$scope.challenges = $rootScope.challenges;
	// Restangular.one('portal').all('category').getList().then(function(success) {
	// 	$scope.categories = success;
	// 	$scope.categories.forEach(function(category) {
	// 		$scope.sortOrFilters.filters.category[category.category_id] = false;
	// 	});
	// 	processParams();
	// });

	// Takes a property name for category or a boolean. If it's a boolean, it will set all category filters to that value.
	$scope.updateCategoryFilters = function(category) {
		if(typeof category === "boolean") {
			for(var property in $scope.sortOrFilters.filters.category) {
				$scope.sortOrFilters.filters.category[property] = category;
			}
			$scope.sortOrFilters.page = 1;
		} else if (category) {
			$scope.sortOrFilters.filters.category[category] = !$scope.sortOrFilters.filters.category[category];
			$scope.sortOrFilters.page = 1;
		}
	}

	$scope.updateSort = function(sort) {
		$scope.sortOrFilters.sort = sort ? sort : '';
	}

	// Set pagination limit based on the smallest of either page limit, or totalentries, depending on entriesperpage
	$scope.getTotalItems = function() {
		var desiredtotal = $scope.sortOrFilters.pagination.entriesperpage * $scope.sortOrFilters.page_limit;
		if(desiredtotal > $scope.sortOrFilters.pagination.totalentries)
			return $scope.sortOrFilters.pagination.totalentries;
		else
			return desiredtotal;
	}

	// Look up matching campaign via title
	$scope.searchTitles = function(term) {
		$scope.sortOrFilters.filters.title = term ? term : '';
	}

	// Update the URL everytime a filter is applied to allow the user to utilize deep linking
	function updateURL() {
		// var firstpage = ($routeParams.page == 1 || $scope.sortOrFilters.page == 1); // Is this the first page?
		// var pageparam = firstpage ? null : $scope.sortOrFilters.page;   // Clear the page param or set page param

		// // Angular has a bug where passing an object in routeProvider's search param results
		// // in printing [object Object] in the url bar. Avoiding that by using an array instead.
		// var categories = [];
		// for(var property in $scope.sortOrFilters.filters.category) {
		// 	if($scope.sortOrFilters.filters.category[property]) categories.push(property);
		// }

		// $location.search('category', categories);
		// $location.search('location', $scope.sortOrFilters.filters.location || null);
		// $location.search('name', $scope.sortOrFilters.filters.title || null);
		// $location.search('sort', $scope.sortOrFilters.sort || null);
		// $location.search('page', pageparam);
	}

	// function updateCampaignListing() {
	// 	RestFullResponse.all('campaign').getList($scope.sortOrFilters).then(function(success) {
	// 		$scope.campaigns = success.data;
	// 		var headers = success.headers();
	// 		$scope.sortOrFilters.pagination.currentpage = headers['x-pager-current-page'];
	// 		$scope.sortOrFilters.pagination.numpages = headers['x-pager-last-page'];
	// 		$scope.sortOrFilters.pagination.nextpage = headers['x-pager-next-page'];
	// 		$scope.sortOrFilters.pagination.pagesinset = headers['x-pager-pages-in-set'];
	// 		$scope.sortOrFilters.pagination.totalentries = headers['x-pager-total-entries'];
	// 		$scope.sortOrFilters.pagination.entriesperpage = headers['x-pager-entries-per-page'];
	// 	});
	// }

	// Process any filter/sort parameters when the page loads
	function processParams() {
		// var category = $routeParams.category;

		// if(category) {
		// 	if(category instanceof Array) {
		// 		category.forEach(function(item) {
		// 			$scope.sortOrFilters.filters.category[item] = true;
		// 		});
		// 	} else {
		// 		$scope.sortOrFilters.filters.category[$routeParams.category] = true;
		// 	}
		// }

		// $scope.sortOrFilters.filters.location = $routeParams.location || $scope.sortOrFilters.filters.location;
		// $scope.sortOrFilters.filters.title = $routeParams.name || $scope.sortOrFilters.filters.title;
		// $scope.sortOrFilters.sort = $routeParams.sort || $scope.sortOrFilters.sort;
		// $scope.sortOrFilters.page = $routeParams.page || 1;
	}

	// If page for paging is no longer the same, update campaign listings
	$scope.$watch("sortOrFilters.page", function(newVal, oldVal){
	  	if(newVal !== oldVal) {
	  		updateURL();
	  		updateCampaignListing($scope.sortOrFilters);
	  	}
	});

	// If there are any sorting or filter changes, update campaign listing and location bar
	$scope.$watch('[sortOrFilters.sort, sortOrFilters.filters]', function(newVal, oldVal) {
		if(!angular.equals(newVal, oldVal)) {
			updateURL();
			updateCampaignListing($scope.sortOrFilters);
		}
	}, true);
});;app.controller('HomeCtrl', function($scope) {
	$scope.hi = "Hello";
});;app.controller('LoginCtrl', function($scope, UserService, $rootScope, $location, APIAuth) {
	$scope.login = function($event) {
		if(!$scope.formData) UserService.init(); // Cache current data
		$scope.formData = $scope.formData ? $scope.formData : UserService;

		// $scope.formData.errors = [];
		// if(!$rootScope.users.length) {
		// 	$scope.formData.errors.push({"message":"Please register first"});
		// 	return;
		// } else {
		// 	$rootScope.users.forEach(function(user) {
		// 		if(user.email == $scope.formData.email && user.password == $scope.formData.password)
		// 			UserService.setLoggedIn(user);
		// 	});
		// }

		APIAuth.login($scope.formData).then(function(success) {
			console.log(success);
		}, function(fail) {
			console.log(fail.data);
		});

		$scope.formData.errors.push({"message":"Invalid credentials, try again"});
	}
});

app.controller('RegCtrl', function($scope, UserService, $rootScope, APIAuth) {
	$scope.createAccount = function($event) {
		if(!$scope.formData) UserService.init(); // Cache current data
		$scope.formData = $scope.formData ? $scope.formData : UserService;
		APIAuth.register($scope.formData).then(function(success) {
			console.log(success.data);
		}, function(fail) {
			console.log(fail.data);
		});
		// $scope.formData.auth_token = "FAKEDATADELETE";
		// $rootScope.users.push(angular.copy($scope.formData));
		$scope.register_form.$setUntouched(); // Don't show any validation errors
		// $scope.formData.successful = {"message":"Account created, please login now!"};
		UserService.reset(); // Success, reset the form
	}
});;app.controller('CampaignStatusCtrl', function($scope, CreateChallengeService) {
	$scope.campaign = CreateChallengeService;
});;app.controller('ProfileCtrl', function($scope, $rootScope, $timeout, Restangular) {
	$scope.user = $rootScope.curruser;
	$scope.newpass = [];

	$scope.saveData = function($event) {
		var invalid_elements = $('form, ng-form').find('.ng-invalid,.has-error');
		if (invalid_elements.length > 0) {
			if($event) {
				$event.preventDefault();
				$event.stopPropagation();
			}
			return;
		}
		console.log('success');
	}

	$scope.onFileSelect = function($files) {
		$scope.selectedFiles = [];
		$scope.dataUrls = [];
		for (var i = 0; i < $files.length; i++) {
			var $file = $files[i];
			if ($file.type.indexOf('image') > -1) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL($files[i]);
				var loadFilePreview = function(fileReader, index) {
					fileReader.onload = function(e) {
						$timeout(function() {
							$scope.user.image = $scope.dataUrls[index] = e.target.result;
						});
					}
				}(fileReader, i);
			}
		}
	}
});;app.service('UserService', function($location, $http, ipCookie, Restangular, $timeout, $rootScope) {
	var User = {
		email: '',
		first_name: '',
		last_name: '',
		auth_token: '',
		about: '',
		image: ''
	}

	// Caches the properties of the object so we can reset it later
	User.init = function() {
		var origVals = {};
		for(var prop in this) {
			if(this.hasOwnProperty(prop) && prop != "origVals") {
				origVals[prop] = this[prop];
			}
		}
		this.origVals = origVals;
	}

	// Reset the properties of the object to the previously cached values
	User.reset = function() {
		for(var prop in this.origVals) {
			this[prop] = this.origVals[prop];
		}
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
		$rootScope.curruser = $rootScope.curruser ? $rootScope.curruser : {};
		if(!ipCookie('wenomyou.user'))
			return false; // Returning the cookie will cause infinite $digest cycles. Return false if loggedin cookie is gone
		else {
			copyObjectProperties(ipCookie('wenomyou.user'), $rootScope.curruser); // If the user refreshes the browser, objects in memory are gone. Retrieve data.
		}
		return !!$rootScope.curruser.auth_token; // If the cookie exists, make sure the auth token exists too
	}

	User.setLoggedIn = function(data) {
		data = data || ipCookie('wenomyou.user');
		if(!data) return false;

		copyObjectProperties(data, User);
		ipCookie('wenomyou.user', data, {expires: 239, expirationUnit: 'minutes'}); // Server currently sets token expiry to 4 hours, prompt re-log before that
		$rootScope.curruser = angular.copy(data);
		$location.path('/explore');
		return true;
	}

	User.setLoggedOut = function() {
		// Log out no matter what the server response is
		// Restangular.one('logout').post().finally(function() {
			// User.email = '';
			// User.first_name = '';
			// User.last_name = '';
			// User.auth_token = '';
			ipCookie.remove('wenomyou.user');
			$rootScope.curruser = 0;
			$location.path('/login');
		// });
	}

	return User;
});