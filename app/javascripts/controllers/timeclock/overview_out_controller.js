//= require "overview_chart_controller"

var OverviewOutController = new JS.Class(OverviewChartController, {
  
  initialize: function(view) {
    this.callSuper();
    this.line = $('ul.overview_chart_out > li.overview_chart_out_item', this.view).detach();
  },
  
  clearLines: function() {
    $('ul.overview_chart_out > li.overview_chart_out_item', this.view).remove();
  },
  
  setLines: function(lines) {
    this.clearLines();
    this.lines = [];
    for(line in lines) {
      this.lines.push(lines[line]);
      $('ul.overview_chart_out', this.view).append(lines[line].view);
    }
  }
});