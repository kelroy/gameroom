//= require "../../sectionable"
//= require "../view_controller"
//= require "../section_controller"
//= require "../date_controller"
//= require "../../models/employee"
//= require "timeclock_admin_employee_controller"
//= require "timeclock_admin_timecards_controller"

var TimeclockAdminController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    this.employee = null;
    this.date = new Date();
    
    this.admin_date_controller = new DateController('form#admin_date');
    this.admin_employee_controller = new TimeclockAdminEmployeeController('form#admin_employee');
    this.admin_timecards_controller = new TimeclockAdminTimecardsController('div#admin_timecards');
    this.admin_section_controller = new SectionController('ul#admin_nav', [
      this.admin_timecards_controller
    ]);
    
    this.admin_date_controller.addObserver(this.updateDate, this);
    this.admin_employee_controller.addObserver(this.updateEmployee, this);
  },
  
  reset: function() {
    this.admin_date_controller.reset();
    this.admin_timecards_controller.reset();
    $('select', this.admin_employee_controller.view).trigger('change');
  },
  
  show: function() {
    this.callSuper();
    this.updateTimecards(this.date, this.employee);
  },
  
  updateDate: function(date) {
    this.date = date;
    this.updateTimecards(this.date, this.employee);
  },
  
  updateEmployee: function(employee) {
    this.employee = employee;
    this.updateTimecards(this.date, this.employee);
  },
  
  updateTimecards: function(date, employee) {
    this.admin_timecards_controller.update(date, employee);
  }
});