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

function updateRide() {
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

function updateProfile() {
	this.submitted = true;
	if (!this.form.$invalid) {
		console.log('valid');
		var currentUser = Meteor.user();
		this.loading = true;
		Meteor.users.update(currentUser._id, {$set: {
			'profile.name': this.name,
			'profile.surname': this.surname,
			'profile.age': this.age,
			'profile.sex': this.sex,
		}}, _.bind(function(error) {
			this.loading = false;
			this.$apply();
		}, this));
	}
}

angular.module('userProfilePage', ['angular-meteor']).controller('UserProfilePageController', [
	'$scope', '$collection', '$subscribe',
	function($scope, $collection, $subscribe) {
		$scope.onUpdateRide = _.bind(onUpdateRide, $scope);

		$scope.updateRide = _.bind(updateRide, $scope);

		$scope.updateProfile = _.bind(updateProfile, $scope);

		$scope.sexes = data.Sexes;

		$subscribe.subscribe('driverProfile');
		var currentUser = Meteor.user();
		if (currentUser) {
			$collection(Rides, {
				driverId: currentUser._id,
				deleted: {$exists: false}
			}).bind($scope, 'rides');
		}
 }]);