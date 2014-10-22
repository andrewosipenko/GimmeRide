function searchRideEvents(options, callback) {
	Meteor.subscribe('searchRideEvents', options, function(err) {
		var minDate = options.utcDateMs;
		var maxDate = options.utcDateMs + 24 * 60 * 60 * 1000;
		Session.set('search', {
			from: options.from,
			to: options.to,
			minDate: minDate,
			maxDate: maxDate,
			limit: options.limit
		});
		callback(err);
	});
}

function search(callback) {
	if (!this.loading) {
		this.loading = true;
    	var options = {
    		from: this.from.value,
    		to: this.to.value,
    		utcDateMs: utils.getUTCDateMs(new Date(this.date)),
    		limit: 10
    	};
    	Places.upsert(this.from.value, {
    		$set: { name: this.from.name }
    	});
    	Places.upsert(this.to.value, {
    		$set: { name: this.to.name }
    	});
    	searchRideEvents(options, _.bind(function(err) {
    		this.loading = false;
    		callback(err, options);
    		this.$apply();
    	}, this));
	}
}

function more(callback) {
	this.moreLoading = true;
	var options = {
		from: this.from.value,
		to: this.to.value,
		utcDateMs: utils.getUTCDateMs(new Date(this.date)),
		limit: this.limit + 10
	};
	searchRideEvents(options, _.bind(function(err) {
		this.moreLoading = false;
		callback(err, options);
		this.$apply();
	}, this));
}

angular.module('mainPage', ['angular-meteor']).controller('MainPageController', ['$scope', '$location',
	function($scope, $location) {
		var params = $location.search();
		var dateMs = parseInt(params.date);
		var limit = parseInt(params.limit) || 10;
		angular.extend($scope, {
			from: params.from,
			to: params.to,
			date: dateMs && moment.utc(dateMs).isValid() &&
				moment.utc(dateMs).format('L') || '',
			limit: limit,
			moreLoading: false,
			loading: false
		});
	    $scope.search = _.bind(search, $scope, _.bind(function(err, options) {
	    	$location.search({
				from: options.from,
				to: options.to,
				date: options.utcDateMs,
				limit: options.limit
			});
    		this.limit = 10;
		}, $scope));

	    $scope.more = _.bind(more, $scope, _.bind(function(err, options) {
	    	$location.search({
				from: options.from,
				to: options.to,
				date: options.utcDateMs,
				limit: options.limit
			});
    		this.limit += 10;
		}, $scope));

	    // Load rides from query params if any.
	    if (params.from && params.to && dateMs) {
	    	$scope.loading = true;
	    	searchRideEvents({
	    		from: params.from,
	    		to: params.to,
	    		utcDateMs: dateMs,
	    		limit: limit
	    	}, function(err) {
	    		$scope.loading = false;
		    	$scope.$apply();
	    	});
	    }
 }]);