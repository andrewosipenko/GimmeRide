ng.controls.directive('ngSelectDate', function() {
    function link(scope, element, attrs) {
        $(element).datepicker({autoclose: true});
    }

    return {
        restrict: 'A',
        link: link
    };
});