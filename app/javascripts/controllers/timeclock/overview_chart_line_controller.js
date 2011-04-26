//= require "../view_controller"
//= require "overview_chart_canvas_controller"

var OverviewChartLineController = new JS.Class(ViewController, {
  
  initialize: function(view, user) {
    this.callSuper();
    this.canvas = new OverviewChartCanvasController($('canvas', this.view), user.timecards());
    this.setName(user.person());
  },
  
  update: function() {
    this.canvas.draw();
  },
  
  setName: function(person) {
    $('h3', this.view).html(person.first_name + ' ' + person.last_name);
  }
});