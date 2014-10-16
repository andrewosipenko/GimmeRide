data = {
	Periods: [
		{id: consts.Times.MON, dayId: 1, name: 'Every Mon'},
		{id: consts.Times.TUE, dayId: 2, name: 'Every Tue'},
		{id: consts.Times.WEN, dayId: 3, name: 'Every Wen'},
		{id: consts.Times.THU, dayId: 4, name: 'Every Thu'},
		{id: consts.Times.FRI, dayId: 5, name: 'Every Fri'},
		{id: consts.Times.SAT, dayId: 6, name: 'Every Sat'},
		{id: consts.Times.SUN, dayId: 0, name: 'Every Sun'}
	],
	Hours: (function() {
		var hours = [];
		for(var h = 0; h < 24; h++) {
			hours.push({
				id: h * 60,
				name: moment({hour: h}).format('HH:mm')
			});
		}
		return hours;
	})()
};