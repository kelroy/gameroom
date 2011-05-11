//= require "../view_controller"
//= require "users_overview_controller"

var UsersController = new JS.Class(ViewController, {
  
  initialize: function(view) {
    this.callSuper();
    
    this.overview_controller = new UsersOverviewController('section#users_overview');
    this.section_controller = new SectionController('ul#users_nav', [
      this.overview_controller
    ]);
    this.reset();
  },
  
  reset: function() {
    this.overview_controller.reset();
    this.section_controller.reset();
  },
  
  activate: function(user) {
    this.view.show();
    this.overview_controller.setUsers(User.all());
    this.section_controller.view.show();
  },
  
  deactivate: function() {
    this.view.hide();
    this.overview_controller.reset();
    this.section_controller.view.hide();
  }
});