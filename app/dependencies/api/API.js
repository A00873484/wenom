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
});