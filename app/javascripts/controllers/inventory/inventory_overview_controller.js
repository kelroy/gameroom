//= require "../../sectionable"
//= require "../search_controller"
//= require "../view_controller"
//= require "../section_controller"
//= require "inventory_overview_results_controller"

var InventoryOverviewController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    this.query = null;
    this.page = null;
    
    this.item_controller = new InventoryItemController('div#item');
    this.overview_search_controller = new SearchController('div#overview_search');
    this.overview_results_controller = new InventoryOverviewResultsController('div#overview_results');
    this.overview_section_controller = new SectionController('ul#overview_nav', [
      this.overview_results_controller
    ]);
    
    this.item_controller.addObserver(this.search, this);
    this.overview_results_controller.addObserver(this.edit, this);
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
    
    if(page == undefined || page == null) {
      page = 1;
    }
    if(query.length > 1) {
      pattern = 'title_or_description_or_sku_contains_any';
    } else {
      pattern = 'title_starts_with';
    }
    this.overview_results_controller.update(Item.search(pattern, query.split(' '), page, 10, this.overview_search_controller.showLoading, this.overview_search_controller.hideLoading));
  },
  
  edit: function(item) {
    this.item_controller.setItem(item);
    this.item_controller.view.show();
  },
  
  onNew: function(event) {
    event.data.instance.item_controller.setItem(null);
    event.data.instance.item_controller.view.show();
    event.preventDefault();
  }
});