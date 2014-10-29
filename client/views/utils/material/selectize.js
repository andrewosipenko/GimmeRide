Selectize.define('selectize_material', function(options) {
    var self = this;

    this.setup = (function() {
        var original = self.setup;
        return function() {
            original.apply(this, arguments);
            this.$control.find('input').addClass('form-control');
        };
    })();
});