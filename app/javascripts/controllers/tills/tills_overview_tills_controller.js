//= require "../../sectionable"
//= require "../view_controller"
//= require "tills_overview_tills_till_controller"

var TillsOverviewTillsController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    this.tills = [];
    this.till_controllers = [];
    this.till = $('li.tills_overview_tills_line', this.view).detach();
    
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
    $('ul#tills_overview_tills_lines > li.tills_overview_tills_line').remove();
  },
  
  setTills: function(tills) {
    this.clearTills();
    this.till_controllers = [];
    for(till in tills) {
      new_till = new TillsOverviewTillsTillController(this.till.clone());
      new_till.set(tills[till]);
      new_till.addObserver(this.actionTill, this);
      this.till_controllers.push(new_till);
      $('ul#tills_overview_tills_lines', this.view).append(new_till.view);
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
    }
  },
  
  onRefresh: function(event) {
    event.data.instance.loadTills();
    event.preventDefault();
  },
  
  showNotice: function() {
    $('h2#tills_overview_tills_notice', this.view).show();
  },
  
  hideNotice: function() {
    $('h2#tills_overview_tills_notice', this.view).hide();
  }
});