app.factory('APIAuth', function(Restangular) {
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