//= require "../../sectionable"
//= require "../view_controller"
//= require "../section_controller"
//= require "../../models/timecard"
//= require "../../models/employee"
//= require "clock_in_out_controller"
//= require "overview_in_controller"
//= require "overview_out_controller"
//= require "overview_chart_line_controller"

var OverviewController = new JS.Class(ViewController, {
  include: Sectionable,
  
  initialize: function(view) {
    this.callSuper();
    
    this.clock_in_out_controller = new ClockInOutController('div#clock_in_out');
    this.overview_in_controller = new OverviewInController('div#overview_in');
    this.overview_out_controller = new OverviewOutController('div#overview_out');
    this.overview_section_controller = new SectionController('ul#overview_nav', [
      this.overview_in_controller,
      this.overview_out_controller
    ]);
    this.reset();
    
    this.overview_section_controller.addObserver(this.updateCanvas, this);
    this.overview_in_controller.addObserver(this.updateCharts, this);
    this.overview_out_controller.addObserver(this.updateCharts, this);
    this.clock_in_out_controller.addObserver(this.updateCharts, this);
    
    var controller = this;
    this.clock_interval = window.setInterval(function() {
      controller.updateClock();
    }, 1000);
    this.canvas_interval = window.setInterval(function() {
      controller.updateCanvas();
    }, 60000);
    
    $('a.clock_in_out', this.view).bind('click', {instance: this}, this.showClockInOut);
  },
  
  reset: function() {
    this.overview_in_controller.clearLines();
    this.overview_out_controller.clearLines();
    this.showInController();
  },
  
  show: function() {
    this.callSuper();
    this.updateCharts();
  },
  
  showInController: function() {
    this.overview_section_controller.showController(0);
  },
  
  showOutController: function() {
    this.overview_section_controller.showController(1);
  },
  
  showClockInOut: function(event) {
    event.data.instance.clock_in_out_controller.view.show();
    event.preventDefault();
  },
  
  findEmployees: function() {
    day_begin = new Date();
    day_end = new Date();
    day_end.setDate(day_begin.getDate() + 1);
    timecards = Timecard.where('(begin >= ? AND begin <= ?) OR (end >= ? AND end <= ?) OR (end IS NULL)', [day_begin.strftime('%Y-%m-%d 05:00:00'), day_end.strftime('%Y-%m-%d 04:59:59'), day_begin.strftime('%Y-%m-%d 05:00:00'), day_end.strftime('%Y-%m-%d 04:59:59')]);
    employees_in = [];
    employees_out = [];
    employees = [];
    for(timecard in timecards) {
      timecard_employee = null;
      for(employee in employees) {
        if(timecards[timecard].employee_id == employees[employee].id) {
          timecard_employee = employees[employee];
        }
      }
      if(timecard_employee == null) {
        if(timecards[timecard].employee_id != null) {
          timecard_employee = Employee.find(timecards[timecard].employee_id);
          timecard_employee._timecards_loaded = true;
          employees.push(timecard_employee);
        }
      }
      if(timecard_employee != null) {
        timecard_employee.addTimecard(timecards[timecard]);
      }
    }
    for(employee in employees) {
      null_found = false;
      timecards = employees[employee].timecards();
      for(timecard in timecards) {
        if(timecards[timecard].end == null) {
          null_found = true;
        }
      }
      if(null_found) {
        employees_in.push(employees[employee]);
      } else {
        employees_out.push(employees[employee]);
      }
    }
    return { employees_in: employees_in, employees_out: employees_out }
  },
  
  updateCharts: function() {
    employees_in_lines = [];
    employees_out_lines = [];
    employees = this.findEmployees();
    for(employee in employees.employees_in) {
      employees_in_lines.push(new OverviewChartLineController(this.overview_in_controller.line.clone(), employees.employees_in[employee]));
    }
    for(employee in employees.employees_out) {
      employees_out_lines.push(new OverviewChartLineController(this.overview_out_controller.line.clone(), employees.employees_out[employee]));
    }
    this.overview_in_controller.setLines(employees_in_lines);
    this.overview_out_controller.setLines(employees_out_lines);
    this.updateCanvas();
  },
  
  updateCanvas: function() {
    this.overview_in_controller.update();
    this.overview_out_controller.update();
  },
  
  updateClock: function() {
    $('h2#overview_datetime', this.view).html(new Date().strftime('%A %B %d %Y %I:%M:%S %P'));
  }
});