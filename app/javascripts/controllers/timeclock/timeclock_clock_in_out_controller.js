//= require "../view_controller"

var TimeclockClockInOutController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    
    $('a.timeclock_cancel', this.view).bind('click', {instance: this}, this.hideClockInOut);
    $('a.timeclock_clock_in_out', this.view).bind('click', {instance: this}, this.doClockInOut);
  },
  
  doClockInOut: function(event) {
    username = $('select#user', event.data.instance.view).val();
    password = $('input#password', event.data.instance.view).val();
    user = User.authenticate(username, password);
    
    if(user != null) {
      event.data.instance.timestampUser(user, function(stamped) {
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
  
  setUsers: function(users) {
    $('select#user', this.view).empty();
    for(user in users) {
      $('select#user', this.view).append($('<option></option>').html(users[user].token).val(users[user].token));
    }
  },
  
  timestampUser: function(user, callback) {
    if(user.stamp()) {
      callback(true);
    } else {
      callback(false);
    }
  }
});