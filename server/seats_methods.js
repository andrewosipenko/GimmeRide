(function() {
	function checkUser() {
		var user = Meteor.user();
		if (!user) {
 			throw new Meteor.Error(401, 'You need to login to be able to request a seat');
		}
	}

	function checkRideEvent(rideEventId) {
		var rideEvent = RideEvents.findOne(rideEventId);
		if (!rideEvent) {
			throw new Meteor.Error(401, 'Requested ride doesnt exist');
		}
	}

	function checkSeatReq(rideEventId, userId) {
		var reqSeat = ReqSeats.findOne({
			rideEventId: rideEventId,
			userId: userId
		});
		if (!reqSeat) {
			throw new Meteor.Error(401, 'No request has been made');
		}
	}

	Meteor.methods({
		reqSeat: function(rideEventId) {
			checkUser();

			checkRideEvent(rideEventId);

			var rideEvent = RideEvents.findOne(rideEventId);
			var ride = Rides.findOne(rideEvent.rideId);
			var endTimeMs = rideEvent.dateMs; // TODO: + ride.endTime - 15min + timeZoneDiff
			if (new Date().getTime() > endTimeMs) {
				throw new Meteor.Error(401, "Ride is finished");
			}
			if (!rideEvent.availSeats) {
				throw new Meteor.Error(501, "All seats are taken");
			}

			var user = Meteor.user();
			var reqSeat = ReqSeats.findOne({
				rideEventId: rideEventId,
				userId: user._id
			});
			if (!reqSeat) {
				ReqSeats.insert({
					rideEventId: rideEventId,
					userId: user._id,
					reqTimeMs: moment.utc().toDate().getTime(), // TODO: should be client datetime.
					availSeats: ride.maxSeats,
					status: consts.Status.AWAITING
				});
			} else {
				throw new Meteor.Error(501, "Request already exists");
			}
		},
		cancelSeatReq: function(rideEventId) {
			checkUser();

			checkRideEvent(rideEventId);

			var user = Meteor.user();
			checkSeatReq(rideEventId, user._id);

			var reqSeat = ReqSeats.findOne({
				rideEventId: rideEventId,
				userId: user._id
			});

			if (reqSeat.status == consts.Status.ACCEPTED) {
				RideEvents.update(rideEventId, {$inc: {availSeats: -1}});
			}
			ReqSeats.remove({
				rideEventId: rideEventId,
				userId: user._id
			});
		},
		acceptSeatReq: function(options) {
			checkUser();

			checkRideEvent(options.rideEventId);

			var rideEvent = RideEvents.find(options.rideEventId);
			if (rideEvent.availSeats) {
				var reqSeat = ReqSeats.update({
					rideEventId: options.rideEventId,
					userId: options.userId
				}, {$set: {status: consts.Status.ACCEPTED}});
				RideEvents.update(options.rideEventId, {$inc: {availSeats: -1}});
			}
		},
		rejectSeatReq: function(options) {
			checkUser();

			checkRideEvent(options.rideEventId);

			var reqSeat = ReqSeats.update({
				rideEventId: options.rideEventId,
				userId: options.userId
			}, {$set: {status: consts.Status.REJECTED}});
		},
		cancelSeatRejection: function(options) {
			checkUser();

			checkRideEvent(options.rideEventId);

			ReqSeats.remove({
				rideEventId: options.rideEventId,
				userId: options.userId
			});
		},
		cancelSeatAcceptance: function(options) {
			checkUser();

			checkRideEvent(options.rideEventId);

			var reqSeat = ReqSeats.update({
				rideEventId: options.rideEventId,
				userId: options.userId
			}, {$set: {status: consts.Status.AWAITING}});
			RideEvents.update(options.rideEventId, {$inc: {availSeats: 1}});
		}
	});
})();