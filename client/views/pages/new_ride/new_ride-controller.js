function create() {
	var options = {
		from: this.from,
		to: this.to,
		car: this.car,
		recurring: this.recurring,
		when: this.recurring ? this.recur :
			utils.getUTCDateMs(new Date(this.date)),
		price: this.price,
		maxSeats: this.maxSeats,
		startTimeMins: this.startTimeMins,
		durationMins: this.durationHours * 60,
	}

	this.submitted = true;
	if (!this.form.$invalid) {
		this.loading = true;
		this.created = true;
		Meteor.call('createRide', options,
			_.bind(function(error, rideEventId) {
				this.loading = false;
				if (!error) {
					this.success = true;
					this.newId = rideEventId;
				}
				this.$apply();
			}, this));
	}
}

angular.module('newRidePage', ['angular-meteor']).controller('NewRidePageController', ['$scope',
	function($scope) {
		angular.extend($scope, {
			created: false,
		 	from: null,
		 	to: null,
		 	recurring: false,
		 	date: moment().format('L'),
		 	recur: null,
		 	startTimeMins: 12 * 60,
		 	durationHours: null,
		 	car: null,
		 	maxSeats: null,
		 	price: null,
		 	free: true,
		 	times: data.Hours,
		 	periods: data.Periods,
		 	submitted: false
		});

		$scope.create = _.bind(create, $scope);
}]);