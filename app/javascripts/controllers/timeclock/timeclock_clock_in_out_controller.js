//= require "../view_controller"

var TimeclockClockInOutController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    
    $('a.timeclock_cancel', this.view).bind('click', {instance: this}, this.hideClockInOut);
    $('a.timeclock_clock_in_out', this.view).bind('click', {instance: this}, this.doClockInOut);
  },
  
  doClockInOut: function(event) {
    username = $('select#employee', event.data.instance.view).val();
    password = $('input#password', event.data.instance.view).val();
    employee = Employee.authenticate(username, password);
    
    if(employee != null) {
      event.data.instance.timestampEmployee(employee, function(stamped) {
        event.data.instance.clearInput();
        event.data.instance.view.hide();
        event.data.instance.notifyObservers();
      });
    }
    event.preventDefault();
  },
  
  clearInput: function() {
    $('input#password', this.view).val(null);
  },
  
  hideClockInOut: function(event) {
    event.data.instance.clearInput();
    event.data.instance.view.hide();
    event.preventDefault();
  },
  
  setEmployees: function(employees) {
    $('select#employee', this.view).empty();
    for(employee in employees) {
      $('select#employee', this.view).append($('<option></option>').html(employees[employee].token).val(employees[employee].token));
    }
  },
  
  timestampEmployee: function(employee, callback) {
    if(employee.stamp()) {
      callback(true);
    } else {
      callback(false);
    }
  }
});