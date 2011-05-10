//= require "../../sectionable"
//= require "../view_controller"
//= require "tills_adjust_controller"
//= require "tills_till_controller"
//= require "tills_admin_tills_till_controller"

var TillsAdminTillsController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    this.tills = [];
    this.till_controllers = [];
    this.till = $('li.tills_admin_tills_line', this.view).detach();
    
    this.adjust_controller = new TillsAdjustController('div#tills_adjust');
    this.adjust_controller.addObserver(this.loadTills, this);
    
    this.till_controller = new TillsTillController('div#tills_till');
    this.till_controller.addObserver(this.loadTills, this);
    
    $('a.tills_new', this.view).bind('click', {instance: this}, this.onNew);
    $('a.tills_refresh', this.view).bind('click', {instance: this}, this.onRefresh);
  },
  
  reset: function() {
    this.tills = [];
    this.till_controllers = [];
    this.clearTills();
  },
  
  loadTills: function() {
    this.setTills(Till.all());
  },
  
  clearTills: function() {
    $('ul#tills_admin_tills_lines > li.tills_admin_tills_line').remove();
  },
  
  setTills: function(tills) {
    this.clearTills();
    this.till_controllers = [];
    for(till in tills) {
      new_till = new TillsAdminTillsTillController(this.till.clone());
      new_till.set(tills[till]);
      new_till.addObserver(this.actionTill, this);
      this.till_controllers.push(new_till);
      $('ul#tills_admin_tills_lines', this.view).append(new_till.view);
    }
    if(tills.length > 0) {
      this.hideNotice();
    } else {
      this.showNotice();
    }
  },
  
  actionTill: function(action, till) {
    switch(action) {
      case 'audit':
        this.notifyObservers(till);
        break;
      case 'adjust':
        this.adjust_controller.update(till);
        this.adjust_controller.view.show();
        break;
      case 'edit':
        this.till_controller.update(till);
        this.till_controller.view.show();
        break;
    }
  },
  
  onNew: function(event) {
    event.data.instance.till_controller.update(null);
    event.data.instance.till_controller.view.show();
    event.preventDefault();
  },
  
  onRefresh: function(event) {
    event.data.instance.loadTills();
    event.preventDefault();
  },
  
  showNotice: function() {
    $('h2#tills_admin_tills_notice', this.view).show();
  },
  
  hideNotice: function() {
    $('h2#tills_admin_tills_notice', this.view).hide();
  }
});