//= require "../../sectionable"
//= require "../view_controller"
//= require "../section_controller"
//= require "../../models/user"
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
  
  findUsers: function() {
    users_in = User._in();
    users_out = User._out();
    return { users_in: users_in, users_out: users_out }
  },
  
  updateCharts: function() {
    users_in_lines = [];
    users_out_lines = [];
    users = this.findUsers();
    for(user in users.users_in) {
      users_in_lines.push(new OverviewChartLineController(this.overview_in_controller.line.clone(), users.users_in[user]));
    }
    for(user in users.users_out) {
      users_out_lines.push(new OverviewChartLineController(this.overview_out_controller.line.clone(), users.users_out[user]));
    }
    this.overview_in_controller.setLines(users_in_lines);
    this.overview_out_controller.setLines(users_out_lines);
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