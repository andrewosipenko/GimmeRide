(function() {
	function getReqSeat(rideEventId) {
		var currentUser = Meteor.user();
 		if (currentUser) {
 			var reqSeat = ReqSeats.findOne({
 				rideEventId: rideEventId,
 				userId: currentUser._id
 			});
 			return reqSeat;
 		} 
	}

	Template.rideEventPage.helpers({
		driverName: function() {
			var ride = Rides.findOne(this.rideId);
			if (ride) {
				var driver = Meteor.users.findOne(ride.driverId);
				return driver && driver.profile.name;
			}
		},
		takenSeats: function() {
			return ReqSeats.find({
 				rideEventId: this._id,
 				status: consts.Status.ACCEPTED
 			}).count();
		},
		ride: function() {
			return Rides.findOne(this.rideId);
		},
		dateStr: function() {
			return moment(this.dateMs).format('DD.MM.YY');
		},
		startTimeStr: function() {
			var ride = Rides.findOne(this.rideId);
			return ride && utils.getTimeStr(ride.startTimeMins);
		},
		endTimeStr: function() {
			var ride = Rides.findOne(this.rideId);
			return ride && utils.getTimeStr(ride.startTimeMins + ride.durationMins);
		},
		isRider: function() {
	 		var currentUser = Meteor.user();
	 		return currentUser && currentUser.profile.type == consts.Users.RIDER;
	 	},
	 	requested: function() {
	 		return !!getReqSeat(this._id);
	 	},
	 	accepted: function() {
 			var reqSeat = getReqSeat(this._id);
 			return reqSeat && reqSeat.status == consts.Status.ACCEPTED;
	 	},
	 	awaiting: function() {
	 		var reqSeat = getReqSeat(this._id);
	 		return reqSeat && reqSeat.status == consts.Status.AWAITING;
	 	},
	 	rejected: function() {
	 		var reqSeat = getReqSeat(this._id);
	 		return reqSeat && reqSeat.status == consts.Status.REJECTED;
	 	}
	});
})();

Template.rideEventPage.events({
	'click .gr-req': function() {
		Meteor.call('reqSeat', this._id, function(error) {});
	},

	'click .gr-cancel': function() {
		Meteor.call('cancelSeatReq', this._id, function(error) {});
	}
});