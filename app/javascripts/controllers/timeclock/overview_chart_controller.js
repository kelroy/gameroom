//= require "../view_controller"

var OverviewChartController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.lines = [];
    
    $('a.refresh', this.view).bind('click', {instance: this}, this.doRefresh);
  },
  
  update: function() {
    for(line in this.lines) {
      this.lines[line].update();
    }
  },
  
  doRefresh: function(event) {
    event.data.instance.notifyObservers();
    event.preventDefault();
  }
});