Meteor.users.deny({
	update: function(userId, user, fields) {
		return userId != user._id || _.without(fields, 'profile').length > 0;
	}
});