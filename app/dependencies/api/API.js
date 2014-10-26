app.factory('APIAuth', function(Restangular) {
	return {
		getUser: function(userid) {
			return Restangular.one('users', userid).get();
		}
	}
});