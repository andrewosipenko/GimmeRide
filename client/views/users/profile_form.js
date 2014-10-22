Template.driverProfilePage.events({
	'click .gr-form-edit .gr-edit-icon': function () {
		$('.gr-form').addClass('edit');
	},
	'click .gr-form-edit .gr-save-icon': function() {
		var changes = {
			name: $('#inName').val(),
			surname: $('#inSurname').val(),
			age: parseInt($('#inAge').val())
		};
		var currentUser = Meteor.user();
		Meteor.users.update(currentUser._id, {$set: {
			'profile.name': changes.name,
			'profile.surname': changes.surname,
			'profile.age': changes.age
		}}, function(error) {
			if (!error) {
				$('.gr-form').removeClass('edit');
			}
		});
	},
	'click .gr-form-edit .gr-cancel-icon': function() {
		$('.gr-form').removeClass('edit');
	}
});