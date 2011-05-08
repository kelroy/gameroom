//= require "../../sectionable"
//= require "timeclock_overview_chart_controller"

var TimeclockOverviewInController = new JS.Class(TimeclockOverviewChartController, {
  include: Sectionable,
  
  initialize: function(view) {
    this.callSuper();
    this.line = $('ul.overview_chart_in > li.overview_chart_in_item', this.view).detach();
  },
  
  clearLines: function() {
    $('ul.overview_chart_in > li.overview_chart_in_item', this.view).remove();
  },
  
  setLines: function(lines) {
    this.clearLines();
    this.lines = [];
    for(line in lines) {
      this.lines.push(lines[line]);
      $('ul.overview_chart_in', this.view).append(lines[line].view);
    }
  }
});