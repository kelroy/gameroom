//= require "../../sectionable"
//= require "../search_controller"
//= require "../view_controller"
//= require "../section_controller"
//= require "repairs_overview_results_controller"

var RepairsOverviewController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    this.query = null;
    this.page = null;
    
    this.repair_controller = new RepairsRepairController('div#repair');
    this.receipt_controller = new RepairsReceiptController('div#receipt');
    this.overview_search_controller = new SearchController('div#overview_search');
    this.overview_results_controller = new RepairsOverviewResultsController('div#overview_results');
    this.overview_section_controller = new SectionController('ul#overview_nav', [
      this.overview_results_controller
    ]);
    
    this.repair_controller.addObserver(this.search, this);
    this.overview_results_controller.addObserver(this.handle, this);
    this.overview_search_controller.addObserver(this.search, this);
    
    $('a.new', this.view).bind('click', {instance: this}, this.onNew);
  },
  
  reset: function() {
    this.query = null;
    this.page = null;
    this.overview_results_controller.reset();
  },
  
  search: function(query, page) {
    this.query = query;
    this.page = page;
    
    if(isNaN(query)) {
      if(page == undefined || page == null) {
        page = 1;
      }
      if(query.length > 1) {
        pattern = 'name_or_serial_or_phone_contains_any';
      } else {
        pattern = 'name_starts_with';
      }
      this.overview_results_controller.update(Repair.search(pattern, query.toString().split(' '), page, 10, this.overview_search_controller.showLoading, this.overview_search_controller.hideLoading));
    } else {
      repair = Repair.find(query);
      if(repair != undefined) {
        this.overview_results_controller.update([repair]);
      } else {
        this.overview_results_controller.update([]);
      }
    }
  },
  
  handle: function(action, repair) {
    switch(action) {
      case 'edit':
        this.edit(repair);
        break;
      case 'print':
        this.print(repair);
        break;
    }
  },
  
  edit: function(repair) {
    this.repair_controller.setRepair(repair);
    this.repair_controller.view.show();
  },
  
  print: function(repair) {
    this.receipt_controller.update('/api/repairs/' + repair.id + '/receipt');
    this.receipt_controller.view.show();
  },
  
  onNew: function(event) {
    event.data.instance.repair_controller.setRepair(null);
    event.data.instance.repair_controller.view.show();
    event.preventDefault();
  }
});