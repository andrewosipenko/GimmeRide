Template.layout.helpers({
 	controllerName: function() {
 		return _.str.capitalize(Router.current().route.getName()) + 'Controller';
 	}
});