//= require "inventory_overview_controller"

var InventoryController = new JS.Class({
  
  initialize: function() {
    this.overview_controller = new InventoryOverviewController('section#overview');
    this.section_controller = new SectionController('ul#inventory_nav', [
      this.overview_controller
    ]);
    this.reset();
  },
  
  reset: function() {
    this.overview_controller.reset();
    this.section_controller.reset();
  }
});