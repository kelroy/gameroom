//= require "../view_controller"

var OverviewController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.updateClock();
    this.clock_interval = window.setInterval(this.updateClock, 1000);
    this.reset();
  },
  
  reset: function() {
  },
  
  updateClock: function() {
    date = new Date();
    $('h2#overview_datetime', this.view).strftime('%A %B %d %Y %H:%M:%S', date);
  }
});