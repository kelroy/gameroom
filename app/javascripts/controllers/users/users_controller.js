//= require "overview_controller"

var UsersController = new JS.Class({
  
  initialize: function() {
    this.overview_controller = new OverviewController('section#overview');
    this.section_controller = new SectionController('ul#users_nav', [
      this.overview_controller
    ]);
    this.reset();
  },
  
  reset: function() {
    this.overview_controller.reset();
    this.section_controller.reset();
  }
});