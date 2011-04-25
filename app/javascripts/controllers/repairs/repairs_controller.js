//= require "repairs_overview_controller"

var RepairsController = new JS.Class({
  
  initialize: function() {
    this.overview_controller = new RepairsOverviewController('section#overview');
    this.section_controller = new SectionController('ul#repairs_nav', [
      this.overview_controller
    ]);
    this.reset();
  },
  
  reset: function() {
    this.overview_controller.reset();
    this.section_controller.reset();
  }
});