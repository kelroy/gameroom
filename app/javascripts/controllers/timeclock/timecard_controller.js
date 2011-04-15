//= require "../view_controller"

var TimecardController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    
    $('a.cancel', this.view).bind('click', {instance: this}, this.hideTimecard);
    $('a.save', this.view).bind('click', {instance: this}, this.onSave);
  },
  
  onSave: function(event) {
    timecard = Timecard.create({
      employee_id: 1,
      begin: new Date(),
      end: new Date()
    });
    event.data.instance.notifyObservers();
    event.preventDefault();
  },
  
  hideTimecard: function(event) {
    event.data.instance.view.hide();
    event.preventDefault();
  }
});