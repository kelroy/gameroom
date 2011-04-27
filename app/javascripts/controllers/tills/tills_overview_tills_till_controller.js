//= require "../view_controller"

var TillsOverviewTillsTillController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.till = null;
    
    $('a.audit', this.view).bind('click', {instance: this}, this.onAudit);
  },
  
  set: function(till) {
    this.till = till;
    
    $('h3.overview_tills_line_title', this.view).html(till.title);
    $('h4.overview_tills_line_description', this.view).html(till.description);
  },
  
  onAudit: function(event) {
    event.data.instance.notifyObservers('audit', event.data.instance.till);
    event.preventDefault();
  }
});