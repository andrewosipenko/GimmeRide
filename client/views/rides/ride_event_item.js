Template.rideEventItem.helpers({
	driverName: function() {
		var ride = Rides.findOne(this.rideId);
		if (ride) {
			var driver = Meteor.users.findOne(ride.driverId);
			return driver && driver.profile.name;
		}
	},
	driverRating: function() {
		var ride = Rides.findOne(this.rideId);
		if (ride) {
			var driver = Meteor.users.findOne(ride.driverId);
			return driver && helpers.ratingCents(driver.profile.rating);
		}	
	},
	isDriver: function() {
 		var currentUser = Meteor.user();
 		return currentUser && currentUser.profile.type == consts.Users.DRIVER;
 	},
	ride: function() {
		return Rides.findOne(this.rideId);
	},
	// Move to a util helper
	dateStr: function() {
		return moment(this.dateMs).format('L');
	},
	timeStr: function() {
		var ride = Rides.findOne(this.rideId);
		if (ride) {
			var startTimeStr = utils.getTimeStr(ride.startTimeMins);
			var endTimeStr = utils.getTimeStr(ride.startTimeMins + ride.durationMins);
			return [startTimeStr, '-', endTimeStr].join(' ');
		}
	},
	driver: function() {
		var ride = Rides.findOne(this.rideId);
		return ride && Meteor.users.findOne(ride.driverId);
	},
	priceStr: function() {
		var ride = Rides.findOne(this.rideId);
		return ride && (ride.price == 0 ? 'Free' : ride.price);
	}
});