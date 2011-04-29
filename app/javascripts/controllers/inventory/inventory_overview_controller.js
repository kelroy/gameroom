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
    if(page == undefined || page == null) {
      page = 1;
    }
    if(query.length > 1) {
      keywords = query.split('|');
      if(keywords.length > 1) {
        pairs = [];
        for(keyword in keywords) {
          pair = keywords[keyword].split('~');
          if(pair.length > 1) {
            pairs.push(pair);
          }
        }
        statement = '';
        match_statements = [];
        params = [];
        for(pair in pairs) {
          match_statements.push(pairs[pair][0] + ' LIKE ?');
          params.push('%' + pairs[pair][1] + '%');
        }
        statement = match_statements.join(' AND ');
        console.log(statement);
        this.overview_results_controller.update(Item.where(statement, params, page, 10, this.overview_results_controller.showLoading, this.overview_results_controller.hideLoading));
      } else {
        pattern = 'title_or_description_or_sku_contains_all';
        this.overview_results_controller.update(Item.search(pattern, query.split(' '), page, 10, this.overview_results_controller.showLoading, this.overview_results_controller.hideLoading));
      }
    } else {
      pattern = 'title_starts_with';
      this.overview_results_controller.update(Item.search(pattern, query.split(' '), page, 10, this.overview_results_controller.showLoading, this.overview_results_controller.hideLoading));
    }
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