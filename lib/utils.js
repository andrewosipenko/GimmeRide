utils = {
	getUTCMs: function(year, month, day) {
		return Date.UTC(year, month - 1, day);
	},
	getUTCDateMs: function(date) {
		return Date.UTC(date.getFullYear(),	date.getMonth(), date.getDate());
	},
	minsToMs: function(minutes) {
		return minutes * 60 * 1000;
	},
	getNowUTCDateMs: function() {
		return utils.getUTCDateMs(new Date());
	},
	getTimeStr: function(timeMins) {
		var timeStr = moment({
			hour: timeMins / 60,
			minute: timeMins % 60
		}).format('HH:mm');
		return timeStr;
	}
};