//= require "../view_controller"
//= require "overview_chart_header_controller"

var OverviewChartController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.lines = [];
    
    this.overview_chart_header_controller = new OverviewChartHeaderController($('canvas.overview_chart_header', this.view));
    
    $('a.refresh', this.view).bind('click', {instance: this}, this.doRefresh);
  },
  
  update: function() {
    for(line in this.lines) {
      this.lines[line].update();
    }
    this.overview_chart_header_controller.draw();
  },
  
  doRefresh: function(event) {
    event.data.instance.notifyObservers();
    event.preventDefault();
  }
});