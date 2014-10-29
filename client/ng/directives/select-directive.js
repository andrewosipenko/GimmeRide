ng.controls.directive('ngSelect', function() {
    function link(scope, element, attrs, ngShow) {

        $(element).selectize({
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            options: scope.options,
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
            initValue: '=?',
            options: '='
        }
    };
});