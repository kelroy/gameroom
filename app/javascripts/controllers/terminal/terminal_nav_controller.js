//= require "../view_controller"

var TerminalNavController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.reset();
    
    $('a.dashboard', this.view).bind('click', {instance: this}, this.onDashboard);
    $('a.logout', this.view).bind('click', {instance: this}, this.onLogout);
  },
  
  reset: function() {
    $('li#terminal_nav_employee', this.view).html('');
    this.view.hide();
  },
  
  update: function(employee) {
    $('li#terminal_nav_employee', this.view).html(employee.token);
    this.view.show();
  },
  
  onDashboard: function(event) {
    event.data.instance.notifyObservers('dashboard');
    event.preventDefault();
  },
  
  onLogout: function(event) {
    event.data.instance.notifyObservers('logout');
    event.preventDefault();
  }
});