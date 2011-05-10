//= require "../view_controller"
//= require "timeclock_overview_controller"
//= require "timeclock_admin_controller"

var TimeclockController = new JS.Class(ViewController, {
  
  initialize: function(view) {
    this.callSuper();
    
    this.overview_controller = new TimeclockOverviewController('section#timeclock_overview');
    this.admin_controller = new TimeclockAdminController('section#timeclock_admin');
    this.section_controller = new SectionController('ul#timeclock_nav', [
      this.overview_controller,
      this.admin_controller
    ]);
    
    this.reset();
  },
  
  reset: function() {
    this.overview_controller.reset();
    this.admin_controller.reset();
    this.section_controller.reset();
  },
  
  activate: function(user) {
    users = User.all();
    
    if(!user.administrator) {
      $('li', this.section_controller.view).eq(1).hide();
    } else {
      $('li', this.section_controller.view).eq(1).show();
    }
    
    this.view.show();
    this.overview_controller.setUsers(users);
    this.admin_controller.setUsers(users);
    this.section_controller.view.show();
    
    this.overview_controller.updateClock();
    this.overview_controller.updateCanvas();
    this.overview_controller.updateCharts();
  },
  
  deactivate: function() {
    this.view.hide();
    this.section_controller.view.hide();
  }
});