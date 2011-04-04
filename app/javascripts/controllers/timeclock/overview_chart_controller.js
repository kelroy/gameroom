//= require "../view_controller"

var OverviewChartController = new JS.Class(ViewController, {
  
  initialize: function(view) {
    this.callSuper();
    
    $('a.refresh', this.view).bind('click', {instance: this}, this.doRefresh);
  },
  
  reset: function() {
    
  },
  
  refresh: function() {
    
  },
  
  update: function(date) {
    
  },
  
  doRefresh: function(event) {
    event.data.instance.refresh();
    event.preventDefault();
  }
});