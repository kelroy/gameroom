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
    
    this.overview_select_controller = new EmployeesOverviewSelectController('form#employees_select_form');
    this.overview_form_controller = new EmployeesOverviewFormController('form#employees_overview_employee');
    this.overview_employee_controller = new EmployeesOverviewEmployeeController('div#employees_overview_employee');
    this.overview_section_controller = new SectionController('ul#employees_overview_nav', [
      this.overview_employee_controller
    ]);
    
    $('a.new', this.view).bind('click', {instance: this}, this.newEmployee);
    
    this.overview_form_controller.addObserver(this.updateEmployees, this);
    this.overview_select_controller.addObserver(this.updateEmployee, this);
  },
  
  reset: function() {
    this.overview_form_controller.reset();
  },
  
  setEmployees: function(employees) {
    this.overview_select_controller.setEmployees(employees);
  },
  
  updateEmployee: function(employee) {
    this.employee = employee;
    this.overview_form_controller.update(employee);
  },
  
  newEmployee: function(event) {
    event.data.instance.overview_select_controller.reset();
    event.data.instance.reset();
    event.preventDefault();
  },
  
  updateEmployees: function() {
    this.setEmployees(Employee.all());
  }
});