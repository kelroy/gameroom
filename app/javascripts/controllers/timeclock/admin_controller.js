//= require "../view_controller"
//= require "../section_controller"
//= require "../date_controller"
//= require "admin_timecards_controller"

var AdminController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.employee = null;
    this.date = new Date();
    
    this.admin_date_controller = new DateController('form#admin_date');
    this.admin_employee_controller = new SelectController('form#admin_employee');
    this.admin_timecards_controller = new AdminTimecardsController('div#admin_timecards');
    this.admin_section_controller = new SectionController('ul#admin_nav', [
      this.admin_timecards_controller.view
    ]);
    this.reset();
    
    this.admin_date_controller.addObserver(this.updateDate, this);
    this.admin_employee_controller.addObserver(this.updateEmployee, this);
  },
  
  reset: function() {
    this.admin_date_controller.reset();
    this.admin_employee_controller.reset();
    this.admin_timecards_controller.reset();
  },
  
  updateDate: function(date) {
    this.date = date;
    this.updateTimecards(date, this.employee);
  },
  
  updateEmployee: function(employee) {
    this.employee = employee;
    this.updateTimecards(this.date, employee);
  },
  
  updateTimecards: function(date, employee) {
    console.log(date);
    console.log(employee);
    this.admin_timecards_controller.update(date, employee);
  }
});