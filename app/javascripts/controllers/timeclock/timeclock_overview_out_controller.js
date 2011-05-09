//= require "../../sectionable"
//= require "timeclock_overview_chart_controller"

var TimeclockOverviewOutController = new JS.Class(TimeclockOverviewChartController, {
  include: Sectionable,
  
  initialize: function(view) {
    this.callSuper();
    this.line = $('ul.timeclock_overview_chart_out > li.timeclock_overview_chart_out_item', this.view).detach();
  },
  
  clearLines: function() {
    $('ul.timeclock_overview_chart_out > li.timeclock_overview_chart_out_item', this.view).remove();
  },
  
  setLines: function(lines) {
    this.clearLines();
    this.lines = [];
    for(line in lines) {
      this.lines.push(lines[line]);
      $('ul.timeclock_overview_chart_out', this.view).append(lines[line].view);
    }
  }
});