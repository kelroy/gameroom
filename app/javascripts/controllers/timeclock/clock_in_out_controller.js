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
    id = $('select#employee', event.data.instance.view).val();
    pin = $('input#pin', event.data.instance.view).val();
    employee = Employee.find(id);
    
    event.data.instance.validateEmployee(employee, pin, function(valid) {
      if(valid) {
        event.data.instance.timestampEmployee(employee, function(stamped) {
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
  
  timestampEmployee: function(employee, callback) {
    if(employee.stamp()) {
      callback(true);
    } else {
      callback(false);
    }
  },
  
  validateEmployee: function(employee, pin, callback) {
    person = employee.person();
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