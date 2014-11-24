app.controller('ProfileCtrl', function($scope, $rootScope, $timeout, Restangular, UserService, APIUser) {
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
							$scope.newuser.image = $scope.dataUrls[index] = e.target.result;
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
});