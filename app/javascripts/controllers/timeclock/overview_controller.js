//= require "../view_controller"
//= require "../section_controller"
//= require "clock_in_out_controller"
//= require "overview_in_controller"
//= require "overview_out_controller"

var OverviewController = new JS.Class(ViewController, {
  
  initialize: function(view) {
    this.callSuper();
    
    this.clock_in_out_controller = new ClockInOutController('div#clock_in_out');
    this.overview_in_controller = new OverviewInController('div#overview_in');
    this.overview_out_controller = new OverviewOutController('div#overview_out');
    this.overview_section_controller = new SectionController('ul#overview_nav', [
      this.overview_in_controller.view,
      this.overview_out_controller.view
    ]);
    this.reset();
    
    this.clock_in_out_controller.addObserver(this.updateCharts, this);
    
    controller = this;
    this.updateClock();
    this.clock_interval = window.setInterval(function() {
      controller.updateClock();
    }, 1000);
    
    $('a.clock_in_out', this.view).bind('click', {instance: this}, this.showClockInOut);
  },
  
  reset: function() {
    this.overview_in_controller.reset();
    this.overview_out_controller.reset();
    this.updateCharts();
    this.showInSection();
  },
  
  showInSection: function() {
    this.overview_section_controller.showSection(0);
  },
  
  showOutSection: function() {
    this.overview_section_controller.showSection(1);
  },
  
  showClockInOut: function(event) {
    event.data.instance.clock_in_out_controller.view.show();
    event.preventDefault();
  },
  
  updateCharts: function() {
    this.overview_in_controller.refresh();
    this.overview_out_controller.refresh();
  },
  
  updateClock: function() {
    date = new Date();
    this.overview_in_controller.update(date);
    $('h2#overview_datetime', this.view).strftime('%A %B %d %Y %H:%M:%S', date);
  }
});