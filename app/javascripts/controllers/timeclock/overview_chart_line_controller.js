//= require "../view_controller"
//= require "../../models/timecard"
//= require "overview_chart_canvas_controller"

var OverviewChartLineController = new JS.Class(ViewController, {
  
  initialize: function(view, user) {
    this.callSuper();
    this.canvas = new OverviewChartCanvasController($('canvas', this.view), this._findTimecards(user));
    this.setName(user.person());
  },
  
  update: function() {
    this.canvas.draw();
  },
  
  setName: function(person) {
    $('h3', this.view).html(person.first_name + ' ' + person.last_name);
  },
  
  _findTimecards: function(user) {
    day_begin = new Date();
    day_end = new Date();
    day_end.setDate(day_begin.getDate() + 1);
    return Timecard.where('user_id = ? AND ((begin >= ? AND begin <= ?) OR (end >= ? AND end <= ?) OR (end IS NULL))', [user.id, day_begin.strftime('%Y-%m-%d 05:00:00'), day_end.strftime('%Y-%m-%d 04:59:59'), day_begin.strftime('%Y-%m-%d 05:00:00'), day_end.strftime('%Y-%m-%d 04:59:59')], 1, 100);
  }
});