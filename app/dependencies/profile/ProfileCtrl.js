app.controller('ProfileCtrl', function($scope, $rootScope, $timeout) {
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
});