app.service('UserService', function($location, $http, ipCookie, Restangular, $timeout, $rootScope) {
	var User = {
		email: '',
		first_name: '',
		last_name: '',
		auth_token: ''
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
		window.user = $rootScope.curruser = $rootScope.curruser ? $rootScope.curruser : {};
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