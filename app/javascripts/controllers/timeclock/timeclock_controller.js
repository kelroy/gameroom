//= require "../view_controller"
//= require "timeclock_overview_controller"
//= require "timeclock_admin_controller"

var TimeclockController = new JS.Class(ViewController, {
  
  initialize: function(view) {
    this.callSuper();
    
    this.overview_controller = new TimeclockOverviewController('section#overview');
    this.admin_controller = new TimeclockAdminController('section#admin');
    this.section_controller = new SectionController('ul#timeclock_nav', [
      this.overview_controller,
      this.admin_controller
    ]);
    
    this.reset();
    
    this.overview_controller.updateClock();
    this.overview_controller.updateCanvas();
    this.overview_controller.updateCharts();
  },
  
  reset: function() {
    this.overview_controller.reset();
    this.admin_controller.reset();
    this.section_controller.reset();
  },
  
  activate: function() {
    this.view.show();
  },
  
  deactivate: function() {
    this.view.hide();
  }
});