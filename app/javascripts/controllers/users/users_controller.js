//= require "edit_controller"

var UsersController = new JS.Class({
  
  initialize: function() {
    this.edit_controller = new EditController('section#edit');
    this.section_controller = new SectionController('ul#users_nav', [
      this.edit_controller
    ]);
    this.reset();
  },
  
  reset: function() {
    this.edit_controller.reset();
    this.section_controller.reset();
  }
});