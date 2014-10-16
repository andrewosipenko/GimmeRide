Template.driverPage.helpers({
	driverRating: function() {
		return (this.rating / 5) * 100;
	}
});