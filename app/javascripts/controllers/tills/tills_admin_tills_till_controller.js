//= require "../view_controller"

var TillsAdminTillsTillController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.till = null;
    
    $('a.edit', this.view).bind('click', {instance: this}, this.onEdit);
    $('a.audit', this.view).bind('click', {instance: this}, this.onAudit);
    $('a.adjust', this.view).bind('click', {instance: this}, this.onAdjust);
    $('a.users', this.view).bind('click', {instance: this}, this.onUsers);
  },
  
  set: function(till) {
    this.till = till;
    
    $('h3.admin_tills_line_title', this.view).html(till.title);
    $('h4.admin_tills_line_description', this.view).html(till.description);
    $('h3.admin_tills_line_balance', this.view).html(Currency.pretty(till.balance()));
  },
  
  onEdit: function(event) {
    event.data.instance.notifyObservers('edit', event.data.instance.till);
    event.preventDefault();
  },
  
  onAudit: function(event) {
    event.data.instance.notifyObservers('audit', event.data.instance.till);
    event.preventDefault();
  },
  
  onAdjust: function(event) {
    event.data.instance.notifyObservers('adjust', event.data.instance.till);
    event.preventDefault();
  },
  
  onUsers: function(event) {
    event.data.instance.notifyObservers('users', event.data.instance.till);
    event.preventDefault();
  }
});