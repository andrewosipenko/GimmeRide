(function() {
	Meteor.methods({
		checkIfUserExistsByEmail: function (email) {
			return !!Meteor.users.findOne({"emails.address" : email})
		}
	});
})();