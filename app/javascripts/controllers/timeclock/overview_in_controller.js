//= require "overview_chart_controller"
//= require "overview_chart_line_controller"
//= require "../../models/employee"

var OverviewInController = new JS.Class(OverviewChartController, {
  
  initialize: function(view) {
    this.callSuper();
  },
  
  refresh: function() {
    today = new Date();
    date = new Date(today.getYear(), today.getMonth(), today.getDate());
    employees = Employee.search('timecards_begin_greater_than', date.valueOf(), 1, 20);
    lines = [];
    for(employee in employees) {
      lines.push(new OverviewChartLineController(this.line.clone(), employees[employee]));
    }
    this.setLines(lines);
  },
  
  setLines: function(lines) {
    this.reset();
    for(line in lines) {
      this.lines.push(lines[line]);
      $('ul.overview_chart_in', this.view).append(lines[line].view);
    }
  }
});