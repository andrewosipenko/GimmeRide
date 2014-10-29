Meteor.startup(function () {
	var app = angular.module('app',
		['angular-meteor', 'app.controls', 'mainPage', 'newRidePage', 'userProfilePage']);
	app.config(['$locationProvider', function($locationProvider) {
	    $locationProvider.html5Mode(true);
	    $locationProvider.hashPrefix('!');
	}]);
	app.run(['$rootScope', function($rootScope) {
		$rootScope.helpers = helpers;
	}]);
	angular.bootstrap(document, ['app']);
});