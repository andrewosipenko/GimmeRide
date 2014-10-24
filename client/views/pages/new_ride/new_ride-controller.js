angular.module('newRidePage', ['angular-meteor']).controller('NewRidePageController', ['$scope',
	function($scope) {
		angular.extend($scope, {
		 	from: null,
		 	to: null,
		 	recurring: false,
		 	date: moment().format('L'),
		 	recur: null,
		 	startTimeMins: 12 * 60,
		 	durationHours: null,
		 	car: null,
		 	maxSeats: null,
		 	price: null,
		 	free: true
		});
}]);