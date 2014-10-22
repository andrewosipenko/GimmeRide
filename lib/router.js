Router.configure({
	layoutTemplate: 'layout'
});

Router.map(function() {
 	this.route('mainPage', {
 		path: '/'
 	});

 	this.route('driverProfilePage', {
 		path: '/profile',
 		data: function() {
 			return Meteor.user();
 		}
 	});

	this.route('driverInfoPage', {
 		path: '/driver/:driverId',
 		waitOn: function() { return Meteor.subscribe('driver', this.params.driverId); },
 		data: function() {
 			var driver = Meteor.users.findOne(this.params.driverId);
 			return driver && driver.profile;
 		}
 	});

 	this.route('rideEventPage', {
 		path: '/ride/:_id',
 		waitOn: function() {
 			return Meteor.subscribe('rideEvent', this.params._id);
 		},
 		data: function() { return RideEvents.findOne({
 				_id: this.params._id,
 				deleted: {$exists: false}
 			});
 		}
 	});

 	this.route('rideSeatsPage', {
 		path: '/riders/:_id',
 		waitOn: function() {
 			return Meteor.subscribe('rideEventSeats', this.params._id);
 		},
 		data: function() { return RideEvents.findOne({
 				_id: this.params._id
 			});
 		}
 	});

 	this.route('myRide', {
 		path: '/myride',
 		waitOn: function() { return Meteor.subscribe('myRide'); },
 		action: function() {
 			if (this.ready()) {
 				var seatReq = ReqSeats.findOne({
 					userId: Meteor.userId()
 				});
 				var rideEventId = seatReq ? seatReq.rideEventId : null;
 				Router.go('rideEventPage', {_id: rideEventId});
 			}
 		}
 	});
 	
 	this.route('driverRideEventListPage', {
 		path: '/myrides',
 		waitOn: function() { return Meteor.subscribe('driverRides'); },
  	});
});


Router.onBeforeAction(function() {
	if (!Meteor.userId()) {
		Router.go('mainPage');
	}
}, {'except': perms.publicRoutes});


// This hack makes angular work with Iron.Router.		
Router.onAfterAction(function() {
	Tracker.afterFlush(function() {
	    angular.element(document).injector().invoke(['$compile', '$document', '$rootScope',
	      	function ($compile, $document, $rootScope) {
	        	$compile($document)($rootScope);
	        	if (!$rootScope.$$phase) $rootScope.$apply();
	      	}
	    ]);
  	});
});
