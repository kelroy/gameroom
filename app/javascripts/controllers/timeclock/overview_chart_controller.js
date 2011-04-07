//= require "../view_controller"

var OverviewChartController = new JS.Class(ViewController, {
  
  initialize: function(view) {
    this.callSuper();
    this.line = $('li.overview_chart_item', this.view).detach();
    this.lines = [];
    
    $('a.refresh', this.view).bind('click', {instance: this}, this.doRefresh);
  },
  
  reset: function() {
    this.lines = [];
    this.clearLines();
  },
  
  update: function(date) {
    for(line in this.lines) {
      this.lines[line].update(date);
    }
  },
  
  clearLines: function() {
    $('ul#overview_chart_list > li.overview_chart_item').remove();
  },
  
  doRefresh: function(event) {
    event.data.instance.refresh();
    event.preventDefault();
  }
});