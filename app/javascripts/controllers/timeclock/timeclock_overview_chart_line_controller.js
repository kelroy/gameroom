//= require "../view_controller"
//= require "../../models/timecard"
//= require "timeclock_overview_chart_canvas_controller"

var TimeclockOverviewChartLineController = new JS.Class(ViewController, {
  
  initialize: function(view, employee) {
    this.callSuper();
    this.canvas = new TimeclockOverviewChartCanvasController($('canvas', this.view), employee);
    this.setName(employee);
  },
  
  update: function() {
    this.canvas.draw();
  },
  
  setName: function(employee) {
    $('h3', this.view).html(employee.token);
  }
});