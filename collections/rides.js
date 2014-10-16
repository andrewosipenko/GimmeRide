Rides = new Meteor.Collection('rides');

RideEvents = new Meteor.Collection('rideEvents');

// Transactions support for Rides.
tx.collectionIndex = {
	'rides' : Rides,
  	'rideEvents' : RideEvents
};