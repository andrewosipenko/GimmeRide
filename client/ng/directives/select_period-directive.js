ng.controls.directive('ngSelectPeriod', function() {
    function link(scope, element, attrs) {

        $(element).selectize({
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            options: data.Periods,
            create: false,
            onChange: function(value) {
                setTimeout(function () {
                    scope.$apply(function () {
                        scope.model = parseInt(value);
                    });
                }, 1);
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