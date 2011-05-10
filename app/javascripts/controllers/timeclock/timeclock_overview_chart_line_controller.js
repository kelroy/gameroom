//= require "../view_controller"
//= require "../../models/timecard"
//= require "timeclock_overview_chart_canvas_controller"

var TimeclockOverviewChartLineController = new JS.Class(ViewController, {
  
  initialize: function(view, user) {
    this.callSuper();
    this.canvas = new TimeclockOverviewChartCanvasController($('canvas', this.view), user);
    this.setName(user);
  },
  
  update: function() {
    this.canvas.draw();
  },
  
  setName: function(user) {
    $('h3', this.view).html(user.token);
  }
});