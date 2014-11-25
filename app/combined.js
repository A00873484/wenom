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
});;app.controller('AdminCtrl', function($scope, APIUser) {
	APIUser.getUsers().then(function(success) {
		$scope.users = success.data;
	}, function(fail) {
		console.log(fail);
	});

	$scope.toggleDisabled = function(user) {
		if(user.disabled) {
			APIUser.enableUser(user.id).then(function(success){
				user.disabled = 0;	
			});
		} else {
			APIUser.disableUser(user.id).then(function(success) {
				user.disabled = 1;
			});
		}
	}

	$scope.delete = function(user) {
		APIUser.deleteUser(user.id).then(function(success) {
			var index = $scope.users.indexOf(user);
	  		$scope.users.splice(index, 1);  
		});
	}
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
});

app.factory('APIChallenge', function(Restangular) {
	return {
		// Get challenges
		getChallenges: function(userObj) {
			return Restangular.one('getChallenges').customGET();
		},

		getChallenge: function(id) {
			return Restangular.one('getChallenge').customGET(id);
		},

		// Create challenge
		// nominee
		// name
		// goal
		// description
		// picture
		// start_date
		// challenge_length
		createChallenge: function(challengeObj) {
			return Restangular.one('createChallenge').customPOST(challengeObj);
		},

		pledge: function(id, amount) {
			return Restangular.one('makePledge').customPOST({'id': id, 'amount': amount});
		},

		getChallengePledges: function(id) {
			return Restangular.one('getChallengePledges').customGET(id);
		}
	}
});

app.factory('APIUser', function(Restangular) {
	return {
		getUsers: function() {
			return Restangular.one('getUsers').customGET();
		},

		getUser: function(id) {
			return Restangular.one('getUser').customGET(id);
		},

		disableUser: function(id) {
			return Restangular.one('changeUserStatus').customPOST({"id": id, "enabled": "false"});
		},

		enableUser: function(id) {
			return Restangular.one('changeUserStatus').customPOST({"id": id, "enabled": "true"});
		},

		updateUser: function(userObj) {
			return Restangular.one('editUser').customPOST(userObj);
		},

		deleteUser: function(id) {
			return Restangular.one('deleteUser').customPOST({"id": id});
		}
	}
});;app.controller('ChallengeCtrl', function($routeParams, $scope, $rootScope, APIChallenge, APIUser) {
	$scope.pledged = false;
	// $scope.challenge = $rootScope.challenges[$routeParams.challengeid - 1];
	APIChallenge.getChallenge($routeParams.challengeid).then(function(success) {
		$scope.challenge = success.data;
		$rootScope.page_title = !angular.isUndefined($scope.challenge.name) ? $scope.challenge.name + ' - ' + $rootScope.site_title : $rootScope.site_title;
		initAuthor();
		updatePledges();
	}, function(fail) {
		console.log(fail);
	});

	function initAuthor() {
		APIUser.getUser($scope.challenge.nominator).then(function(success) {
			$scope.nominator = success.data;
		});
	}

	function updatePledges() {
		APIChallenge.getChallengePledges($scope.challenge.id).then(function(success) {
			$scope.pledges = success.data;
			convertDates();
		});
	}

	function convertDates() {
		$scope.pledges.forEach(function(pledge) {
			pledge.created_date = new Date(pledge.created_date);
		});
	}

	$scope.dateInPast = function(value) {
		return moment(value) < moment(new Date());
	}

	$scope.pledge = function(id, amount) {
		if(id && amount) {
			APIChallenge.pledge(id, amount).then(function(success) {
				$scope.pledged = true;
				$scope.challenge.funded_amount = success.data;
				updatePledges();
			});
		}
	}
});;app.controller('CreateChallengeCtrl', function($scope, CreateChallengeService, APIAuth, $timeout, $rootScope, APIChallenge) {
	// CreateChallengeService.enforceFormProgress(); // If the user hasn't started the challenge, send them back to the start
	if(!$scope.challenge) CreateChallengeService.init(); // If this controller wasn't called with an existing challenge, cache the current (empty) data
	$scope.challenge = CreateChallengeService;

	// if($rootScope.challenges.length) {
	// 	$scope.challenge.id = parseInt($rootScope.challenges[$rootScope.challenges.length - 1].id) + 1;
	// }

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

		APIChallenge.createChallenge($scope.challenge).then(function(success) {

		});
		// $rootScope.challenges.push(angular.copy($scope.challenge));
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
							$scope.challenge.picture = $scope.dataUrls[index] = e.target.result;
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
		picture: '',
		created: '',
		description: '',
		nominee: '',
		goal: '0',
		funded_amount: '0',
		start_date: '',
		challenge_length: '',
		ends: '',

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

app.filter('inArray', function($filter){
    return function(list, arrayFilter, element){
        if(arrayFilter){
            return $filter("filter")(list, function(listItem){
                return arrayFilter.indexOf(listItem[element]) != -1;
            });
        }
    };
});

// Requires moment.js
app.filter('formatDate', function() {
	return function(input, formatting) {
		return moment(input).format(formatting);
	}
});

app.filter('fromNow', function() {
	return function(input) {
		return moment(input).fromNow();
	}
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

// Sends keystrokes to a designated endpoint
app.directive('keyboardPoster', function($parse, $timeout){
	var DELAY_BEFORE_FIRING = 100;
	return function(scope, elem, attrs) {

		var element = angular.element(elem)[0];
		var currentTimeout = null;
		element.oninput = function() {
			var model = $parse(attrs.postFunction);
			var poster = model(scope);

			if(currentTimeout) {
				$timeout.cancel(currentTimeout)
			}
			currentTimeout = $timeout(function(){
				poster(angular.element(element).val());
			}, DELAY_BEFORE_FIRING)
		}
	}
});

// On button click, check if the nearest form has any fields that are invalid, then scrolls and focuses the first of those fields
app.directive('accessibleForm', function() {
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
});;app.controller('ExploreCtrl', function($scope, $routeParams, $location, Restangular, $rootScope, API_URL, APIChallenge){
	var placeholderchallenges;
	$scope.sortOrFilters = {
		"sort": '',
		"filters": {
			"nominee": '',
			"challenge": ''
		}
	}
	processParams();
	APIChallenge.getChallenges().then(function(success) {
		placeholderchallenges = success.data;
		$rootScope.challenges = placeholderchallenges;
		$scope.challenges = $rootScope.challenges;
		filterChallenges();
		console.log(success.data);
	}, function(fail) {
		console.log(fail);
	});
	// Temporary placeholders for challenge display, replace with data from API
	// var placeholderchallenges = [
	// 	{
	// 		id: '1',
	// 		name: 'ALS ice bucket challenge',
	// 		created: 'Sat Oct 25 2014 00:55:23 GMT-0700 (Pacific Daylight Time)',
	// 		image: '',
	// 		nominee: 'Enoch Yip',
	// 		url: serverurl + 'challenge/',
	// 		description: "Dump ice on yourself and pretend you're making a positive impact.",
	// 		funded_amount: '19',
	// 		goal: '50'
	// 	},
	// 	{
	// 		id: '2',
	// 		name: 'Swim in a volcano',
	// 		created: 'Wed Oct 29 2014 00:55:23 GMT-0700 (Pacific Daylight Time)',
	// 		image: '',
	// 		nominee: 'Danny Lieu',
	// 		url: serverurl + 'challenge/',
	// 		description: 'Self explanatory.',
	// 		funded_amount: '50000',
	// 		goal: '30000000'
	// 	},
	// 	{
	// 		id: '3',
	// 		name: 'Ask a white girl to coffee!!!',
	// 		created: 'Fri Oct 24 2014 00:55:23 GMT-0700 (Pacific Daylight Time)',
	// 		image: '',
	// 		nominee: 'Thanh Lai',
	// 		url: serverurl + 'challenge/',
	// 		description: '2T? (;',
	// 		funded_amount: '880000',
	// 		goal: '1000000'
	// 	},
	// 	{
	// 		id: '4',
	// 		name: 'Super cool challenge',
	// 		created: 'Wed Oct 15 2014 00:55:23 GMT-0700 (Pacific Daylight Time)',
	// 		image: '',
	// 		nominee: 'Daniel Engelhard',
	// 		url: serverurl + 'challenge/',
	// 		description: "",
	// 		funded_amount: '5',
	// 		goal: '99'
	// 	},
	// ];

	// Restangular.one('portal').all('category').getList().then(function(success) {
	// 	$scope.categories = success;
	// 	$scope.categories.forEach(function(category) {
	// 		$scope.sortOrFilters.filters.category[category.category_id] = false;
	// 	});
	// 	processParams();
	// });

	// Takes a property name for category or a boolean. If it's a boolean, it will set all category filters to that value.
	// $scope.updateCategoryFilters = function(category) {
	// 	if(typeof category === "boolean") {
	// 		for(var property in $scope.sortOrFilters.filters.category) {
	// 			$scope.sortOrFilters.filters.category[property] = category;
	// 		}
	// 		$scope.sortOrFilters.page = 1;
	// 	} else if (category) {
	// 		$scope.sortOrFilters.filters.category[category] = !$scope.sortOrFilters.filters.category[category];
	// 		$scope.sortOrFilters.page = 1;
	// 	}
	// }

	function filterChallenges() {
		updateFilteredIds();
	}

	function updateFilteredIds() {
		$scope.filteredIds = [];
		var challengeval = $scope.sortOrFilters.filters.challenge || '';
		var nomineeval = $scope.sortOrFilters.filters.nominee || ''
		$scope.challenges.forEach(function(challenge) {
			if(isMatch(challengeval, challenge.name) && isMatch(nomineeval, challenge.nominee))
				$scope.filteredIds.push(challenge.id);
		});
	}

	function isMatch(searchVal, searchData) {
		if(!searchVal) return true; // Empty filter, return true
		if(!searchData) return false; // No data to match, return false
		searchVal = searchVal.replace(/\s+/g, ' ').toLowerCase();
		searchData = searchData.replace(/\s+/g, ' ').toLowerCase();
		return !!~searchData.indexOf(searchVal);
	}

	$scope.updateSort = function(sort) {
		$scope.sortOrFilters.sort = sort ? sort : '';
	}

	// Set pagination limit based on the smallest of either page limit, or totalentries, depending on entriesperpage
	// $scope.getTotalItems = function() {
	// 	var desiredtotal = $scope.sortOrFilters.pagination.entriesperpage * $scope.sortOrFilters.page_limit;
	// 	if(desiredtotal > $scope.sortOrFilters.pagination.totalentries)
	// 		return $scope.sortOrFilters.pagination.totalentries;
	// 	else
	// 		return desiredtotal;
	// }

	// Look up matching campaign via challenge
	$scope.searchChallenge = function(term) {
		$scope.sortOrFilters.filters.challenge = term ? term : '';
		filterChallenges();
	}

	// Look up matching campaign via nominee name
	$scope.searchNominee = function(term) {
		$scope.sortOrFilters.filters.nominee = term ? term : '';
		filterChallenges();
	}

	// Update the URL everytime a filter is applied to allow the user to utilize deep linking
	function updateURL() {
		// var firstpage = ($routeParams.page == 1 || $scope.sortOrFilters.page == 1); // Is this the first page?
		// var pageparam = firstpage ? null : $scope.sortOrFilters.page;   // Clear the page param or set page param

		// Angular has a bug where passing an object in routeProvider's search param results
		// in printing [object Object] in the url bar. Avoiding that by using an array instead.
		// var categories = [];
		// for(var property in $scope.sortOrFilters.filters.category) {
		// 	if($scope.sortOrFilters.filters.category[property]) categories.push(property);
		// }

		// $location.search('category', categories);
		$location.search('nominee', $scope.sortOrFilters.filters.nominee || null);
		$location.search('challenge', $scope.sortOrFilters.filters.challenge || null);
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
		$scope.sortOrFilters.filters.challenge = $routeParams.challenge || $scope.sortOrFilters.filters.challenge;
		$scope.sortOrFilters.filters.nominee = $routeParams.nominee || $scope.sortOrFilters.filters.nominee;
		$scope.filterchallengename = $scope.sortOrFilters.filters.challenge;
		$scope.filternomineename = $scope.sortOrFilters.filters.nominee;
		// $scope.sortOrFilters.sort = $routeParams.sort || $scope.sortOrFilters.sort;
		// $scope.sortOrFilters.page = $routeParams.page || 1;
	}

	// If page for paging is no longer the same, update campaign listings
	// $scope.$watch("sortOrFilters.page", function(newVal, oldVal){
	//   	if(newVal !== oldVal) {
	//   		updateURL();
	//   		// updateCampaignListing($scope.sortOrFilters);
	//   	}
	// });

	// If there are any sorting or filter changes, update campaign listing and location bar
	$scope.$watch('[sortOrFilters.sort, sortOrFilters.filters]', function(newVal, oldVal) {
		if(!angular.equals(newVal, oldVal)) {
			updateURL();
			// updateCampaignListing($scope.sortOrFilters);
		}
	}, true);
});;app.controller('HomeCtrl', function($scope) {
	$scope.hi = "Hello";
});;app.controller('LoginCtrl', function($scope, UserService, $rootScope, $location, APIAuth) {
	$scope.login = function($event) {
		if(!$scope.formData) UserService.init(); // Cache current data
		$scope.formData = $scope.formData ? $scope.formData : UserService;
		$scope.formData.errors = [];
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
			UserService.setLoggedIn(success.data);
			console.log(success.data);
		}, function(fail) {
			console.log(fail.data);
			$scope.formData.errors.push({"message":"Invalid credentials, try again"});
		});

		// $scope.formData.errors.push({"message":"Invalid credentials, try again"});
	}
});

app.controller('RegCtrl', function($scope, UserService, $rootScope, APIAuth) {
	$scope.createAccount = function($event) {
		if(!$scope.formData) UserService.init(); // Cache current data
		$scope.formData = $scope.formData ? $scope.formData : UserService;
		APIAuth.register($scope.formData).then(function(success) {
			// console.log(success.data);
			$scope.formData.successful = {"message":"Account created, please login now!"};
		}, function(fail) {
			console.log(fail.data);
		});
		// $scope.formData.auth_token = "FAKEDATADELETE";
		// $rootScope.users.push(angular.copy($scope.formData));
		$scope.register_form.$setUntouched(); // Don't show any validation errors
		UserService.reset(); // Success, reset the form
	}
});;app.controller('NavCtrl', function($scope, CreateChallengeService, $location) {
	$scope.campaign = CreateChallengeService;
	$scope.isActive = function (viewLocation) { 
        return $location.path().indexOf(viewLocation) == 0;
    };
});;app.controller('ProfileCtrl', function($scope, $rootScope, $timeout, Restangular, UserService, APIUser) {
	$scope.user = $rootScope.curruser;
	$scope.newuser = copyNotValues(UserService);
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
		// if($scope.newpass[1]) {
			$scope.newuser.password = 'google';//$scope.newpass[1];
		// }

		APIUser.updateUser($scope.newuser).then(function(success) {
			UserService.updateUserData(success.data);
			console.log(success.data);
		}, function(fail) {
			console.log(fail);
		});
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
							$scope.newuser.picture = $scope.dataUrls[index] = e.target.result;
						});
					}
				}(fileReader, i);
			}
		}
	}

	function copyNotValues(obj) {
        var newObj = angular.copy(obj);
        for (prop in newObj) {
            if(newObj.hasOwnProperty(prop))
            {
                newObj[prop] = '';
            }
        };
        return newObj;
    }
});;app.service('UserService', function($location, $http, ipCookie, Restangular, $timeout, $rootScope, APIUser) {
	$rootScope.curruser = $rootScope.curruser ? $rootScope.curruser : {};
	var User = {
		email: '',
		first_name: '',
		last_name: '',
		auth_token: '',
		about: '',
		picture: ''
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
		ipCookie('wenomyou.user', User, {expires: 60, expirationUnit: 'minutes'}); // Update the cookie data or new User data will be overwritten
	}

	function copyObjectProperties(srcObj, destObj) {
		for(var key in srcObj) {
			if(key != 'picture') {
				destObj[key] = srcObj[key];
			} else {
				srcObj[key] = '';
			}
		}
	}

	User.isLoggedIn = function() {
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
		console.log(ipCookie('wenomyou.user', data, {expires: 60, expirationUnit: 'minutes'})); // Server currently sets token expiry to 24 hours, prompt re-log before that
		$rootScope.curruser = angular.copy(User);
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