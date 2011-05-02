//= require "../view_controller"
//= require "../../models/timecard"
//= require "overview_chart_canvas_controller"

var OverviewChartLineController = new JS.Class(ViewController, {
  
  initialize: function(view, user) {
    this.callSuper();
    this.canvas = new OverviewChartCanvasController($('canvas', this.view), user);
    this.setName(user);
  },
  
  update: function() {
    this.canvas.draw();
  },
  
  setName: function(user) {
    $('h3', this.view).html(user.login);
  }
});