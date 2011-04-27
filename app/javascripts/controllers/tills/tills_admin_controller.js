//= require "../../sectionable"
//= require "../view_controller"

var TillsAdminController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    
    this.admin_tills_controller = new TillsAdminTillsController('div#admin_tills');
    this.admin_section_controller = new SectionController('ul#admin_nav', [
      this.admin_tills_controller
    ]);
    
    this.admin_tills_controller.addObserver(this.auditTill, this);
  },
  
  reset: function() {
    this.admin_section_controller.reset();
    this.admin_tills_controller.reset();
    this.update();
  },
  
  update: function() {
    this.admin_tills_controller.loadTills();
  },
  
  auditTill: function(till) {
    this.notifyObservers(till);
  }
});