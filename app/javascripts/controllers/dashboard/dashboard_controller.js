//= require "../view_controller"

var DashboardController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    
    $('a.transactions', this.view).bind('click', {instance: this}, this.onTransactions);
    $('a.timeclock', this.view).bind('click', {instance: this}, this.onTimeclock);
    $('a.tills', this.view).bind('click', {instance: this}, this.onTills);
    $('a.inventory', this.view).bind('click', {instance: this}, this.onInventory);
    $('a.reports', this.view).bind('click', {instance: this}, this.onReports);
    $('a.users', this.view).bind('click', {instance: this}, this.onUsers);
  },
  
  activate: function() {
    this.view.show();
  },
  
  deactivate: function() {
    this.view.hide();
  },
  
  onTransactions: function(event) {
    event.data.instance.notifyObservers('transactions');
    event.preventDefault();
  },
  
  onTimeclock: function(event) {
    event.data.instance.notifyObservers('timeclock');
    event.preventDefault();
  },
  
  onTills: function(event) {
    event.data.instance.notifyObservers('tills');
    event.preventDefault();
  },
  
  onInventory: function(event) {
    event.data.instance.notifyObservers('inventory');
    event.preventDefault();
  },
  
  onReports: function(event) {
    event.data.instance.notifyObservers('reports');
    event.preventDefault();
  },
  
  onUsers: function(event) {
    event.data.instance.notifyObservers('users');
    event.preventDefault();
  },
});