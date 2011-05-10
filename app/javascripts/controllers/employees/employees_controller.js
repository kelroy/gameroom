//= require "../view_controller"
//= require "employees_overview_controller"

var EmployeesController = new JS.Class(ViewController, {
  
  initialize: function(view) {
    this.callSuper();
    
    this.overview_controller = new EmployeesOverviewController('section#employees_overview');
    this.section_controller = new SectionController('ul#employees_nav', [
      this.overview_controller
    ]);
    this.reset();
  },
  
  reset: function() {
    this.overview_controller.reset();
    this.section_controller.reset();
  },
  
  activate: function() {
    this.view.show();
    this.overview_controller.setEmployees(Employee.all());
  },
  
  deactivate: function() {
    this.overview_controller.reset();
    this.view.hide();
  }
});