//= require "../view_controller"
//= require "overview_chart_canvas_controller"

var OverviewChartLineController = new JS.Class(ViewController, {
  
  initialize: function(view, employee) {
    this.callSuper();
    this.canvas = new OverviewChartCanvasController($('canvas', this.view), employee.timecards());
    this.setName(employee.person());
  },
  
  update: function() {
    this.canvas.draw();
  },
  
  setName: function(person) {
    $('h3', this.view).html(person.first_name + ' ' + person.last_name);
  }
});