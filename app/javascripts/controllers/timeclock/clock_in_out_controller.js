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
    id = $('select#user', event.data.instance.view).val();
    pin = $('input#pin', event.data.instance.view).val();
    user = User.find(id);
    
    event.data.instance.validateUser(user, pin, function(valid) {
      if(valid) {
        event.data.instance.timestampUser(user, function(stamped) {
          event.data.instance.clearInput();
          event.data.instance.view.hide();
          event.data.instance.notifyObservers();
        });
      } else {
        // Invalid. Do something?
      }
    });
    event.preventDefault();
  },
  
  clearInput: function() {
    $('input#pin', this.view).val(null);
  },
  
  hideClockInOut: function(event) {
    event.data.instance.clearInput();
    event.data.instance.view.hide();
    event.preventDefault();
  },
  
  timestampUser: function(user, callback) {
    if(user.stamp()) {
      callback(true);
    } else {
      callback(false);
    }
  },
  
  validateUser: function(user, pin, callback) {
    person = user.person();
    if(person.user() != undefined) {
      user = person.user();

      if(user.pin == pin) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  }
});