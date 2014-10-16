// TODO(alexb): this file needs to be broke down to multiple files.
Meteor.publish('searchRideEvents', function(options) {
	// TODO(alexb): options checks.
	var rideIds = Rides.find({
		from: options.from,
		to: options.to,
		deleted: {$exists: false}
	}).map(function(ride) {
		return ride._id;
	});

	var maxDate = options.utcDateMs + 24 * 60 * 60 * 1000;
	var minDate = options.utcDateMs;

	var rideEvents = RideEvents.find({
		rideId: {$in: rideIds},
		dateMs: {$lt: maxDate, $gte: minDate},
		deleted: {$exists: false}
	}, {limit: options.limit});
	rideIds = rideEvents.map(function(rideEvent) {
		return rideEvent.rideId;
	});
	var rides = Rides.find({_id: {$in: rideIds}});
	var driverIds = rides.map(function(ride) {
		return ride.driverId;
	});

	return [rides, rideEvents,
			Places.find({_id: {$in: [options.from, options.to]}}),
			Meteor.users.find({_id: {$in: driverIds}})];
});

Meteor.publish('rides', function() {
	return Rides.find();
});

Meteor.publish('rideEvent', function(rideEventId) {
	var rideEvent = RideEvents.findOne({
		_id: rideEventId,
		deleted: {$exists: false}
	});
	if (rideEvent) {
		var ride = Rides.findOne(rideEvent.rideId);
		var cursors = [RideEvents.find(rideEventId),
					   Rides.find(rideEvent.rideId), 
					   Meteor.users.find(ride.driverId)];
		if (this.userId) {
			cursors.push(ReqSeats.find({rideEventId: rideEventId, userId: this.userId}));
		}
		return cursors;
	}
});

Meteor.publish('rideEventSeats', function(rideEventId) {
	// TODO: check if driver.
	var reqSeats = ReqSeats.find({rideEventId: rideEventId});
	var userIds = reqSeats.map(function(reqSeat) {
		return reqSeat.userId;
	});
	var rideEvent = RideEvents.findOne(rideEventId);

	return [Rides.find(rideEvent.rideId), RideEvents.find(rideEventId),
			reqSeats, Meteor.users.find({_id: {$in: userIds}})];	
});


Meteor.publish('driverRides', function() {
	if (this.userId) {
		var rideIds = Rides.find({
			driverId: this.userId,
			deleted: {$exists: false}
		}).map(function(ride) {
			return ride._id;
		});
		var rideEventIds = RideEvents.find({
			rideId: {$in: rideIds},
			deleted: {$exists: false}
		}).map(function(rideEvent) {
			return rideEvent._id;
		});

		var reqSeats = ReqSeats.find({rideEventId: {$in: rideEventIds}});
		var userIds = reqSeats.map(function(reqSeat) {
			return reqSeat.userId;
		});
		rideEventIds = reqSeats.map(function(reqSeat) {
			return reqSeat.rideEventId;
		});
		var rideEvents = RideEvents.find({
			_id: {$in: rideEventIds}
		});
		rideIds = rideEvents.map(function(rideEvent) {
			return rideEvent.rideId;
		});

		return [Rides.find({_id: {$in: rideIds}}), rideEvents,
				reqSeats, Meteor.users.find({_id: {$in: userIds}})];	
	}
});

Meteor.publish('driver', function(driverId) {
	return [Meteor.users.find(driverId)];
});

Meteor.publish('driverProfile', function() {
	var rides = Rides.find({
		driverId: this.userId,
		deleted: {$exists: false}
	});
	var fromIds = rides.map(function(ride) {
		return ride.from;
	});
	var toIds = rides.map(function(ride) {
		return ride.to;
	});
	return [Rides.find({
				driverId: this.userId,
				deleted: {$exists: false}
			}), Places.find({_id: {$in: _.union(fromIds, toIds)}})];
});

Meteor.publish('myRide', function() {
	if (this.userId) {
		return [ReqSeats.find({userId: this.userId})];
	}
});

Meteor.publish('place', function(placeId) {
	return [Places.find(placeId)];
});
