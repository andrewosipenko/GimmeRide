Template.rideSeatsPage.helpers({
 	ride: function() {
 		return Rides.findOne(this.rideId);
 	},
	dateStr: function() {
		return this.dateMs && moment(this.dateMs).format('L');
	},
 	// Move to a util helper.
 	startTimeStr: function() {
 		var ride = Rides.findOne(this.rideId);
 		return ride && utils.getTimeStr(ride.startTimeMins);
 	},
 	endTimeStr: function() {
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

Template.rideSeatsPage.events({
	'click .gr-reserve': function() {

	}
});