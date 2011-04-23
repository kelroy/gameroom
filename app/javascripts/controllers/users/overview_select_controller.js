//= require "../view_controller"

var OverviewSelectController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();

    $('select', this.view).bind('change', {instance: this}, this.onUser);
  },
  
  onUser: function(event) {
    id = parseInt($('select', this.view).val());
    if(!isNaN(id)) {
      event.data.instance.notifyObservers(User.find(id));
    }
    event.preventDefault();
  }
});