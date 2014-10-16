ng.controls.directive('ngSelectTime', function() {
    function link(scope, element, attrs, ngShow) {
        var initialized = false; 

        $(element).selectize({
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            options: data.Hours,
            create: false,
            onChange: function(value) {
                setTimeout(function () {
                    scope.$apply(function () {
                        scope.model = parseInt(value);
                    });
                });
            } 
        });

        var selectize = $(element)[0].selectize;
        scope.$watch('ngShow', function(value) {
            if (!_.isUndefined(value)) {
                selectize.$wrapper.toggle(value);
            }
        });

        scope.$watch('initValue', function(value) {
            if (value) {
                selectize.setValue(value);
            }
        });
    }

    return {
        restrict: 'A',
        link: link,
        scope: {
            ngShow: '=?',
            model: '=?',
            initValue: '=?'
        }
    };
});