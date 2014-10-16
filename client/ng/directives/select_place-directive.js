ng.controls.directive('ngSelectPlace', function() {
    function link(scope, element, attrs) {
        var countries = attrs.countries || '';

        $(element).selectize({
            valueField: 'id',
            labelField: 'place',
            searchField: 'place',
            create: false,
            render: {
                option: function(item, escape) {
                    return '<div>' +
                        '<span class="place">' + escape(item.place) + '</span>' +
                        '<span class="region">' + escape(item.region || '') + '</span>' +
                    '</div>';
                }
            },
            load: function(query, callback) {
                this.clearOptions();
                this.renderCache = {};
                if (!query.length) {
                    return callback();
                }
                var service = new google.maps.places.AutocompleteService();
                service.getPlacePredictions({
                    input: query,
                    types: ['(cities)']
                },
                function(predictions, status) {
                    if (status != google.maps.places.PlacesServiceStatus.OK) {
                        callback();
                        return;
                    }
                    var items = [];
                    _.each(predictions, function(prediction) {
                        var len = prediction.terms.length;
                        var lastTerm = prediction.terms[len - 1];
                        if (countries.indexOf(lastTerm['value']) != -1) {
                            items.push({
                                id: prediction.place_id,
                                place: prediction.terms[0].value,
                                region: len > 2 ? prediction.terms[1].value : ''
                            });
                        }
                    });
                    callback(items);
                });
            },
            onChange: function(value) {
                var self = this;
                setTimeout(function () {
                    scope.$apply(function () {
                        scope.model = {
                            value: value,
                            name: self.getItem(value).text()
                        };
                    });
                });
            }   
        });

        scope.$watch('initValue', function(value) {
            if (value) {
                var selectize = $(element)[0].selectize;
                selectize.load(function(callback) {
                    Meteor.subscribe('place', value, function() {
                        var place = Places.findOne(value);
                        if (place) {
                            callback([{id: place._id, place: place.name}]);
                            selectize.setValue(place._id);
                        }
                    });
                });
            }
        });
    }

    return {
        restrict: 'A',
        link: link,
        scope: {
            initValue: '=?',
            model: '=?'
        }
    };
});