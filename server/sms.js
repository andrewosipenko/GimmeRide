(function() {
	Meteor.methods({
		sendPhoneVerificationSMS: function(phone, phoneOwnerEmail) {
			var verificationCode = Math.floor((Math.random() * 8999) + 1000).toString(); // random number from 1000 to 9999
			sendSMS(phone, phoneOwnerEmail, 'Verification code: ' + verificationCode);
			PhoneVerificationCodes.insert({
				phone : phone,
				when: Date.now(),
				code: verificationCode
			});
		},
		verifyPhone: function(phone, verificationCode) {
			var phoneVerificationCode = PhoneVerificationCodes.findOne({
				phone : phone,
				code : verificationCode
			});
			if(phoneVerificationCode){
				PhoneVerificationCodes.remove({phone : phone});
			}
			return !!phoneVerificationCode;
		}
	});
	function sendSMS(phone, phoneOwnerEmail, text){
		var testMode = true;
		if(testMode){
			// Use email instead of real SMS sending
			console.log(phoneOwnerEmail + ' - sending email');
			Email.send({
				from: 'sms@gimmeride.by',
				to: phoneOwnerEmail,
				subject: 'SMS',
				text: text
			});
			console.log(phoneOwnerEmail + ' - email has been send');
		}
		else{
			// TODO: implement actual SMS sending
		}
	}
})();