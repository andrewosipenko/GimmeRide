Template.nav.helpers({
 	isDriver: function() {
 		var currentUser = Meteor.user();
 		return currentUser && currentUser.profile.type == consts.Users.DRIVER;
 	},
 	activeRouteClass: function(routeName) {
		return Router.current().route.name == routeName && 'active';
 	}
});