if (Rides.find().count() == 0) {
	Accounts.createUser({
		username: 'user1',
		email: 'user1@ride.by',
		password: '11111',
		profile: {
			name: 'Vadim',
			surname: 'Hitchhiker',
			age: 25,
			rating: 4,
			type: consts.Users.RIDER
		}
	});
	var driverId1 = Accounts.createUser({
		username: 'driver1',
		email: 'driver1@ride.by',
		password: '22222',
		profile: {
			name: 'Vladimir',
			surname: 'John',
			age: 35,
			rating: 3,
			type: consts.Users.DRIVER
		}
	});
	var driverId2 = Accounts.createUser({
		username: 'driver2',
		email: 'driver2@ride.by',
		password: '33333',
		profile: {
			name: 'Andrew',
			surname: 'Honnold',
			age: 30,
			rating: 4,
			type: consts.Users.DRIVER
		}
	});

	var rideId1 = Rides.insert({
		driverId: driverId1,
		car: 'Ford Transit',
		maxSeats: 6,
		from: 'ChIJ02oeW9PP20YR2XC13VO4YQs',
		to: 'ChIJo-3kuenP2EYR6DaaW7uMh8g',
		price: 30000,
		recurring: false,
		when: utils.getUTCMs(2014, 10, 20),
		startTimeMins: 9 * 60,  // minutes
		durationMins: 120,
		path: []
	});

	for (var i = 0; i < 12; i++) {
		RideEvents.insert({
			rideId: rideId1,
			availSeats: 2,
			dateMs: utils.getUTCMs(2014, 10, 20)
		});
	}

	var rideId2 = Rides.insert({
		driverId: driverId2,
		car: 'VW Transporter',
		maxSeats: 10,
		from: 'ChIJ02oeW9PP20YR2XC13VO4YQs',
		to: 'ChIJo-3kuenP2EYR6DaaW7uMh8g',
		price: 30000,
		recurring: true,
		when: consts.Times.MON,
		startTimeMins: 12 * 60,  // minutes
		durationMins: 120,  // minutes
		path: []
	});

	RideEvents.insert({
		rideId: rideId2,
		availSeats: 5,
		dateMs: utils.getUTCMs(2014, 10, 1)
	});
}