//= require "../../sectionable"
//= require "../view_controller"
//= require "../section_controller"
//= require "../../models/employee"
//= require "timeclock_clock_in_out_controller"
//= require "timeclock_overview_in_controller"
//= require "timeclock_overview_out_controller"
//= require "timeclock_overview_chart_line_controller"

var TimeclockOverviewController = new JS.Class(ViewController, {
  include: Sectionable,
  
  initialize: function(view) {
    this.callSuper();
    
    this.clock_in_out_controller = new TimeclockClockInOutController('div#clock_in_out');
    this.overview_in_controller = new TimeclockOverviewInController('div#overview_in');
    this.overview_out_controller = new TimeclockOverviewOutController('div#overview_out');
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
    employees_in = Employee._in();
    employees_out = Employee._out();
    return { employees_in: employees_in, employees_out: employees_out }
  },
  
  updateCharts: function() {
    employees_in_lines = [];
    employees_out_lines = [];
    employees = this.findEmployees();
    for(employee in employees.employees_in) {
      employees_in_lines.push(new TimeclockOverviewChartLineController(this.overview_in_controller.line.clone(), employees.employees_in[employee]));
    }
    for(employee in employees.employees_out) {
      employees_out_lines.push(new TimeclockOverviewChartLineController(this.overview_out_controller.line.clone(), employees.employees_out[employee]));
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