// Limits the input field to only contain numbers. If anything else is input, it will be removed.
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
});