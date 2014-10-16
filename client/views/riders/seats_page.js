Template.seatsPage.helpers({
 	ride: function() {
 		return Rides.findOne(this.rideId);
 	},
 	placeFrom: function() {
		var ride = Rides.findOne(this.rideId);
		return ride && utils.getPlaceName(ride.from);
	},
	placeTo: function() {
		var ride = Rides.findOne(this.rideId);
		return ride && utils.getPlaceName(ride.to);
	},
	dateStr: function() {
		return this.dateMs && moment(this.dateMs).format('L');
	},
 	// Move to a util helper.
 	startTimeStr: function() {
 		var ride = Rides.findOne(this.rideId);
 		return ride && utils.getTimeStr(ride.startTimeMins);
 	},
 	endTime: function() {
 		var ride = Rides.findOne(this.rideId);
 		return ride && utils.getTimeStr(ride.startTimeMins + ride.durationMins);
 	},
	acceptedSeats: function () {
 		return ReqSeats.find({rideEventId: this._id, status: consts.Status.ACCEPTED});
 	},
 	awaitSeats: function() {
 		return ReqSeats.find({rideEventId: this._id, status: consts.Status.AWAITING});
 	},
 	rejectedSeats: function() {
 		return ReqSeats.find({rideEventId: this._id, status: consts.Status.REJECTED});
 	}
});

Template.seatsPage.events({
	'click .gr-reserve': function() {

	}
});