Template.reqSeatItem.helpers({
	userName: function() {
		var user = Meteor.users.findOne(this.userId);
		return user && user.profile.name;
	},
	userRating: function() {
		var user = Meteor.users.findOne(this.userId);
		return helpers.ratingWidthStr(user.profile.rating);
	},
	reqTime: function () {
		return moment(this.reqTimeMs).format('L HH:mm');
	},
	accepted: function () {
		return this.status == consts.Status.ACCEPTED;
	},
	awaiting: function () {
		return this.status == consts.Status.AWAITING;
	},
	rejected: function () {
		return this.status == consts.Status.REJECTED;
	}
});


Template.reqSeatItem.events({
	'click button.gr-accept': function() {
		Meteor.call('acceptSeatReq', {
			rideEventId: this.rideEventId,
			userId: this.userId
		}, function(error) {});
	},
	'click button.gr-reject': function() {
		Meteor.call('rejectSeatReq', {
			rideEventId: this.rideEventId,
			userId: this.userId
		}, function(error) {});
	},
	'click button.gr-cancel': function() {
		Meteor.call('cancelSeatAcceptance', {
			rideEventId: this.rideEventId,
			userId: this.userId
		}, function(error) {});
	},
	'click button.gr-cancel-reject': function() {
		Meteor.call('cancelSeatRejection', {
			rideEventId: this.rideEventId,
			userId: this.userId
		}, function(error) {});
	},
});