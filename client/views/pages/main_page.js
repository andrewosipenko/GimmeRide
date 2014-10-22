function findRideEvents(from, to, minDateMs, maxDateMs) {
	var rideIds = Rides.find({
			from: from,
			to: to,
			deleted: {$exists: false}
		}).map(function(ride) {
		return ride._id;
	});
	return RideEvents.find({
		rideId: {$in: rideIds},
		dateMs: {$lt: maxDateMs, $gte: minDateMs},
		deleted: {$exists: false}
	});
}

Template.mainPage.helpers({
 	rideEvents: function() {
 		var search = Session.get('search');
 		return search &&
 			findRideEvents(
 				search.from,
 				search.to,
 				search.minDate,
 				search.maxDate);
 	},
 	noMore: function() {
 		var search = Session.get('search');
 		if (search) {
	 		var count = findRideEvents(
				search.from,
				search.to,
				search.minDate,
				search.maxDate).count();
 			return search.limit != count;
 		}
 		return true;
 	}
});