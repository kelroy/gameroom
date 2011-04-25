//= require "../../sectionable"
//= require "../view_controller"
//= require "repairs_repair_controller"
//= require "repairs_overview_results_repair_controller"

var RepairsOverviewResultsController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    this.repairs = [];
    this.repair_controllers = [];
    this.repair = $('tr.repair_line', this.view).detach();
  },
  
  reset: function() {
    this.repairs = [];
    this.repair_controllers = [];
    this.clearRepairs();
  },
  
  update: function(repairs) {
    this.setRepairs(repairs);
  },
  
  clearRepairs: function() {
    $('table#repair_lines > tbody > tr.repair_line').remove();
  },
  
  setRepairs: function(repairs) {
    this.clearRepairs();
    this.repairs = repairs;
    this.repair_controllers = [];
    for(repair in repairs) {
      new_repair = new RepairsOverviewResultsRepairController(this.repair.clone());
      new_repair.set(repairs[repair]);
      new_repair.addObserver(this.updateRepair, this);
      this.repair_controllers.push(new_repair);
      $('table#repair_lines tbody', this.view).append(new_repair.view);
    }
    if(repairs.length > 0) {
      this.hideNotice();
    } else {
      this.showNotice();
    }
  },
  
  updateRepair: function(action, repair) {
    switch(action) {
      case 'edit':
        this.notifyObservers('edit', repair);
        break;
      case 'print':
        this.notifyObservers('print', repair);
        break;
    }
  },
  
  showNotice: function() {
    $('h2#repair_notice', this.view).show();
    $('table#repair_lines', this.view).hide();
  },
  
  hideNotice: function() {
    $('h2#repair_notice', this.view).hide();
    $('table#repair_lines', this.view).show();
  }
});