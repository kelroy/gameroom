//= require "../view_controller"

var ClockInOutController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    
    $('a.cancel', this.view).bind('click', {instance: this}, this.hideClockInOut);
    $('a.clock_in_out', this.view).bind('click', {instance: this}, this.doClockInOut);
    $('form', this.view).submit(function(event) {
      event.preventDefault();
    });
  },
  
  doClockInOut: function(event) {
    id = '';
    pin = '';
    
    event.data.instance.validateUser(id, pin, function(valid) {
      if(valid) {
        event.data.instance.timestampUser(id, function() {
          event.data.instance.view.hide();
          event.data.instance.notifyObservers();
        });
      }
    });
    event.preventDefault();
  },
  
  hideClockInOut: function(event) {
    event.data.instance.view.hide();
    event.preventDefault();
  },
  
  timestampUser: function(id, callback) {
    callback();
  },
  
  validateUser: function(id, pin, callback) {
    // Do validation
    callback(true);
  }
});