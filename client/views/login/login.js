(function() {
	// used for signup flow
	var signupUser = {
		profile : {}
	};
	Template.loginButtons.events({
		'click #login-button': function(event) {
			event.stopPropagation();
			Meteor.loginWithPassword(trimmedElementValueById('login-email'), trimmedElementValueById('login-password'), function(error) {
				if(error) {
					$('#login-error').text(error.reason).show();
				}
				else{
					$('#login-password').val('');
					$('#login-modal').modal('hide');
				}
			});
		},
		'click #forgot-password-link': function(event) {
			event.stopPropagation();
			Session.set('forgotPassword', true);
		},
		'click #close-forgot-password': function(event) {
			// continue propagation to close modal
			Session.set('forgotPassword', false);
		},
		'click #reset-password-button': function(event) {
			event.stopPropagation();
			var email = trimmedElementValueById("forgot-password-email");
			$('#login-error').hide();
			if(!email) {
				$('#login-error').text('Email is required').show();
				return;
			}
			Accounts.forgotPassword(
				{email: email},
				function(error) {
					if (error) {
						$('#login-success').hide();
						$('#login-error').text('Email is incorrect').show();
					}
					else {
						$('#login-success').text('Reset password email send').show();
						$('#login-error').hide();
					}
				}
			);
		},
		'click #logout-button': function(event) {
			event.stopPropagation();
			Meteor.logout();
		},
		'click #signup-button': function(event, template) {
			event.stopPropagation();
			signupUser.email = trimmedElementValueById('signup-email');
			if(!signupUser.email) {
				$('#signup-error').text('Email is required').show();
				return;
			}
			var minPasswordLength = 6;
			if($('#signup-password').val().length < minPasswordLength){
				$('#signup-error').text('Password cant be shorter than ' + minPasswordLength + ' characters').show();
				return;
			}
			if($('#signup-password').val() != $('#signup-password-repeat').val()){
				$('#signup-error').text('Passwords do not match').show();
				return;
			}
			var type = $('#type').val();
			if(!type){
				$('#signup-error').text('Select account type').show();
				return;
			}
			var prefix = '+375';
			var phone = signupUser.profile.phone = trimmedElementValueById('phone');
			if(phone.length < prefix.length || phone.substring( 0, prefix.length ) != prefix){
				$('#signup-error').text('Номер телефона должен начинаться с ' + prefix).show();
				return;
			}

			signupUser.profile.type = type;
			signupUser.profile.name = trimmedElementValueById('first-name');
			signupUser.profile.surname = trimmedElementValueById('last-name');
			signupUser.profile.company = trimmedElementValueById('company');
			signupUser.password = $('#signup-password').val();
			$('#signup-error').hide();
			Meteor.call('checkIfUserExistsByEmail', signupUser.email, function(error, result) {
				if(error) {
					$('#signup-error').text(error).show();
					return;
				}
				if(result) {
					$('#signup-error').text('The email is registered in the system already').show();
					return;
				}
				Meteor.call('sendPhoneVerificationSMS', phone, signupUser.email, function(error, result) {
					if(error) {
						$('#signup-error').text(error).show();
						return;
					}
				});
				Session.set('verifyPhone', true);
			});
		},
		'click #signup2-button': function(event, template) {
			event.stopPropagation();
			var phoneVerificationCode = trimmedElementValueById('pnone-verification-code');
			Meteor.call('verifyPhone', signupUser.profile.phone, phoneVerificationCode, function(error, result) {
				if(result) {
					Accounts.createUser(signupUser, function(error){
						if(error){
							$('#signup-error').text(error.reason || "Unknown error").show();
						}
						else{
							signupUser = {profile : {}};
							$('#signup-modal').modal('hide');
						}
					});
				}
				else{
					$('#signup-error').text('Verification code is not correct').show();
				}
			});
		},
		'click #signup-back-button': function(event) {
			event.stopPropagation();
			$('#signup-error').hide();
			Session.set('verifyPhone', false);
		}
	});
	Template.loginButtons.helpers({
		verifyPhone: function() {
			return Session.get('verifyPhone');
		},
		forgotPassword: function() {
			return Session.get('forgotPassword');
		},
		signupUser: function(){
			return signupUser
		},
		accountTypes: function(){
			var res = [];
			$.each(
				consts.Users,
				function(key,value) {
					res.push({key : key, value : value, selected : value == signupUser.profile.type });
				}
			);
			return res;
		}
	});
	var trimmedElementValueById = function(id) {
		var element = document.getElementById(id);
		if (!element)
			return null;
		else
			return element.value.replace(/^\s*|\s*$/g, ""); // trim;
	};
})();