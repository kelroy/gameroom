//= require "../../sectionable"
//= require "../view_controller"
//= require "employees_overview_form_controller"
//= require "employees_overview_select_controller"
//= require "employees_overview_employee_controller"

var EmployeesOverviewController = new JS.Class(ViewController, {
  include: Sectionable,
  
  initialize: function(view) {
    this.callSuper();
    this.employee = null;
    
    this.overview_select_controller = new EmployeesOverviewSelectController('form#overview_select');
    this.overview_form_controller = new EmployeesOverviewFormController('form#overview_employee');
    this.overview_employee_controller = new EmployeesOverviewEmployeeController('div#overview_employee');
    this.overview_section_controller = new SectionController('ul#overview_nav', [
      this.overview_employee_controller
    ]);
    
    $('a.new', this.view).bind('click', {instance: this}, this.newEmployee);
    
    this.overview_select_controller.addObserver(this.updateEmployee, this);
  },
  
  reset: function() {
    this.overview_form_controller.reset();
  },
  
  updateEmployee: function(employee) {
    this.employee = employee;
    this.overview_form_controller.update(employee);
  },
  
  newEmployee: function(event) {
    event.data.instance.reset();
    event.preventDefault();
  }
});