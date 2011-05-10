//= require "../../sectionable"
//= require "../view_controller"
//= require "tills_overview_tills_controller"

var TillsOverviewController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    
    this.overview_tills_controller = new TillsOverviewTillsController('div#tills_overview_tills');
    this.overview_section_controller = new SectionController('ul#tills_overview_nav', [
      this.overview_tills_controller
    ]);
    
    this.overview_tills_controller.addObserver(this.auditTill, this);
  },
  
  reset: function() {
    this.overview_tills_controller.reset();
    this.update();
  },
  
  update: function() {
    this.overview_tills_controller.loadTills();
  },
  
  auditTill: function(till) {
    this.notifyObservers(till);
  }
});