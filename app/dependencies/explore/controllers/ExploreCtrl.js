app.controller('ExploreCtrl', function($scope, $routeParams, $location, Restangular, $rootScope, API_URL){
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
			description: 'Description',
			funded_amount: '19',
			goal: '50'
		},
		{
			id: '2',
			name: 'Swim in a volcano',
			created: 'Wed Oct 29 2014 00:55:23 GMT-0700 (Pacific Daylight Time)',
			image: '',
			url: serverurl + 'challenge/',
			description: 'Description',
			funded_amount: '50000',
			goal: '30000000'
		},
		{
			id: '3',
			name: 'Ask a white girl to coffee!!!',
			created: 'Fri Oct 24 2014 00:55:23 GMT-0700 (Pacific Daylight Time)',
			image: '',
			url: serverurl + 'challenge/',
			description: 'Description',
			funded_amount: '880000',
			goal: '1000000'
		},
		{
			id: '4',
			name: 'Super cool challenge',
			created: 'Wed Oct 15 2014 00:55:23 GMT-0700 (Pacific Daylight Time)',
			image: '',
			url: serverurl + 'challenge/',
			description: 'Description',
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
});