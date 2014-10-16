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
			return driver && (driver.profile.rating / 5) * 100;
		}	
	},
	isDriver: function() {
 		var currentUser = Meteor.user();
 		return currentUser && currentUser.profile.type == consts.Users.DRIVER;
 	},
	ride: function() {
		return Rides.findOne(this.rideId);
	},
	placeFrom: function() {
		var ride = Rides.findOne(this.rideId);
		if (ride) {
			var place = Places.findOne(ride.from);
			return place && place.name;
		}
	},
	placeTo: function() {
		var ride = Rides.findOne(this.rideId);
		if (ride) {
			var place = Places.findOne(ride.to);
			return place && place.name;
		}
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