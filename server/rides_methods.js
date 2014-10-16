(function() {
	function createRideEvents(rideId, recurring, when, maxSeats) {
		if (!recurring) {
			tx.insert(RideEvents, {
				rideId: rideId,
				availSeats: maxSeats,
				dateMs: when
			});
		} else {
			var periods = _.filter(data.Periods, function(period) {
				return period.id & when;
			});
			var dayIds = _.map(periods, function(period) {
				return period.dayId;
			});
			var plusMonth = moment().add(30, 'days').format();
			var recur = moment().recur(plusMonth).every(dayIds).daysOfWeek();
			var allDates = recur.all();
			_.each(allDates, function(date) {
				tx.insert(RideEvents, {
					rideId: rideId,
					availSeats: maxSeats,
					dateMs: utils.getUTCDateMs(date.toDate())
				});
			});
		}
	}

	Meteor.methods({
		createRide: function(options) {
			// TODO: check if a driver.

			tx.start('new ride');

			var rideId = tx.insert(Rides, {
				driverId: this.userId,
				car: options.car,
				maxSeats: options.maxSeats,
				from: options.from,
				to: options.to,
				price: options.price,
				recurring: options.recurring,
				when: options.when,
				startTimeMins: options.startTimeMins,
				durationMins: options.durationMins
			}, {instant: true});

			createRideEvents(
				rideId,
				options.recurring,
				options.when,
				options.maxSeats);

			tx.commit();
		},
		updateRide: function(options) {
			// TODO: check if ride exists and belongs to user.
			var ride = Rides.findOne({
				_id: options.rideId,
				deleted: {$exists: false}
			});

			var isDateChanged = ride.recurring != options.recurring ||
				ride.when != options.when;
			var isSeatsChanged = ride.maxSeats != options.maxSeats;

			tx.start('update ride');

			tx.update(Rides, options.rideId, {
				$set: {
					car: options.car,
					maxSeats: options.maxSeats,
					from: options.from,
					to: options.to,
					price: options.price,
					recurring: options.recurring,
					when: options.when,
					startTimeMins: options.startTime,
					durationMins: options.duration
				}
			});

			var todayMs = moment.utc() + utils.minsToMs(ride.startTimeMins);
			if (isDateChanged) {
				tx.remove(RideEvents, {$and: [
					{rideId: options.rideId},
					{$gt: {dateMs: todayMs}}
				]});
				createRideEvents(
					options.rideId,
					options.recurring,
					options.when,
					options.maxSeats);
			} else {
				if (isSeatsChanged) {
					tx.update(RideEvents, {$and: [
						{rideId: options.rideId},
						{$gt: {dateMs: todayMs}},
						{deleted: {$exists: false}}
					]}, { 
						$set: {maxSeats: options.maxSeats}
					});
				}
			}

			tx.commit();
		},
		deleteRide: function(rideId) {
			var ride = Rides.findOne({
				_id: rideId, 
				deleted: {$exists: false}
			});
			if (ride) {
				// TODO: check if current ride event has riders, if not 
				// remove current too.
				tx.start('remove ride');

				var todayMs = moment.utc() + utils.minsToMs(ride.startTimeMins);
				tx.remove(Rides, rideId);
				RideEvents.find({rideId: rideId}).forEach(function(rideEvent) {
					tx.remove(RideEvents, rideEvent);
				});

				tx.commit();
			}
		}
	});	
})();