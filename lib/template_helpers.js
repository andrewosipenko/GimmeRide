if (Meteor.isClient) {
	helpers = {
		rideDateStr: function(ride) {
			if (!ride.recurring) {
				return moment.utc(ride.when).format('L');
			} else {
				var periods = _.filter(data.Periods, function(period) {
					return period.id & ride.when;
				}, ride);
				var labels = _.map(periods, function(period) {
					return period.text.toLowerCase();
				});
				// TODO: this is temporary.
				return _.first(labels);
			}
		},
		rideTimeStr: function(ride) {
			var startTimeStr = utils.getTimeStr(ride.startTimeMins);
			var endTimeStr = utils.getTimeStr(ride.startTimeMins + ride.durationMins);
			return startTimeStr + ' - ' + endTimeStr;
		},
		ridePriceStr: function(ride) {
			return !ride.price ? 'Free' : ride.price;
		},
		ratingCents: function(rating) {
			return (rating / 5) * 100;
		},
		placeFrom: function(rideId) {
			var ride = Rides.findOne(this.rideId);
			if (ride) {
				var place = Places.findOne(ride.from);
				return place && place.name;
			}
		},
		placeTo: function(rideId) {
			var ride = Rides.findOne(this.rideId);
			if (ride) {
				var place = Places.findOne(ride.to);
				return place && place.name;
			}
		}
	}

	Template.registerHelper('isEmpty', function(cursor) {
		if (cursor) {
			check(cursor, isCursor);
			return !cursor.count();	
		}
		return true;
	});

	Template.registerHelper('rideDateStr', helpers.rideDateStr);

	Template.registerHelper('rideTimeStr', helpers.rideTimeStr);

	Template.registerHelper('ridePriceStr', helpers.ridePriceStr);

	Template.registerHelper('ratingCents', helpers.ratingCents);

	Template.registerHelper('placeFrom', helpers.placeFrom);

	Template.registerHelper('placeTo', helpers.placeTo);
}