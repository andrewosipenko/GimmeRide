
function onUpdateRide(ride) {
	angular.extend(this, {
		new: false,
		rideId: ride._id,
	 	from: ride.from,
	 	to: ride.to,
	 	recurring: ride.recurring,
	 	date: !ride.recurring ? moment.utc(ride.when).format('L') : null,
	 	recur: ride.recurring ? ride.when : null,
	 	startTimeMins: ride.startTimeMins,
	 	durationHours: ride.durationMins / 60,
	 	car: ride.car,
	 	maxSeats: ride.maxSeats,
	 	price: ride.price,
	 	free: !ride.price
	});
}

function onCreateRide() {
	angular.extend(this, {
		new: true,
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
	 	free: true
	});
}

function update() {
	var options = {
		rideId: this.rideId,
		from: this.from.value,
		to: this.to.value,
		car: this.car,
		recurring: this.recurring,
		when: this.recurring ? this.recur :
			utils.getUTCDateMs(new Date(this.date)),
		price: this.price,
		maxSeats: this.maxSeats,
		startTimeMins: this.startTimeMins,
		durationMins: this.durationHours * 60
	}

	Meteor.call('updateRide', options,
		function(error) {
			if (!error) {
				$('#rideDlg').modal('hide');
			}
		});
}

function create() {
	var options = {
		from: this.from.value,
		to: this.to.value,
		car: this.car,
		recurring: this.recurring,
		when: this.recurring ? this.recur :
			utils.getUTCDateMs(new Date(this.date)),
		price: this.price,
		maxSeats: this.maxSeats,
		startTimeMins: this.startTimeMins,
		durationMins: this.durationHours * 60
	}

	Meteor.call('createRide', options,
		function(error) {
			if (!error) {
				$('#rideDlg').modal('hide');
			}
		});
}

angular.module('driverProfilePage', ['angular-meteor']).controller('DriverProfileController', [
	'$scope', '$collection', '$subscribe',
	function($scope, $collection, $subscribe) {
		$scope.onUpdateRide = _.bind(onUpdateRide, $scope);

		$scope.onCreateRide = _.bind(onCreateRide, $scope);

		$scope.update = _.bind(update, this);

		$scope.create = _.bind(create, this);

		$subscribe.subscribe('driverProfile');
		var currentUser = Meteor.user();
		if (currentUser) {
			$collection(Rides, {
				driverId: currentUser._id,
				deleted: {$exists: false}
			}).bind($scope, 'rides');
		}

		$scope.placeFrom = function(item) {
			var place = Places.findOne(item.from);
			return place && place.name;
		};

		$scope.placeTo = function(item) {
			var place = Places.findOne(item.to);
			return place && place.name;
		}
 }]);