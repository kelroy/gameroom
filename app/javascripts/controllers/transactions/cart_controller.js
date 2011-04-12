//= require "../view_controller"
//= require "../search_controller"
//= require "cart_lines_controller"
//= require "cart_form_controller"
//= require "cart_search_results_controller"

var CartController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.cart_lines_controller = new CartLinesController('div#cart_lines');
    this.cart_form_controller = new CartFormController('div#cart_form');
    this.cart_search_controller = new SearchController('div#cart_search');
    this.cart_search_results_controller = new CartSearchResultsController('div#cart_search_results');
    this.cart_section_controller = new SectionController('ul#cart_nav', [
      this.cart_lines_controller.view,
      this.cart_form_controller.view,
      this.cart_search_results_controller.view
    ]);
    this.cart_search_controller.addObserver(this.search, this);
    this.cart_search_controller.addObserver(this.showSearchSection, this);
    this.cart_lines_controller.addObserver(this.setLines, this);
    this.cart_search_results_controller.addObserver(this.addLines, this);
    this.cart_form_controller.addObserver(this.addLines, this);
    
    this.reset();
  },
  
  reset: function() {
    this.cart_lines_controller.reset();
    this.cart_form_controller.reset();
    this.cart_search_controller.reset();
    this.cart_search_results_controller.reset();
    this.cart_section_controller.reset();
    $('h2#cart_summary', this.view).html('0 item(s): ' + Currency.pretty(0));
    this.showFormSection();
  },
  
  search: function(query, page) {
    if(page == undefined || page == null) {
      page = 1;
    }
    if(query.length > 1) {
      pattern = 'title_or_description_or_sku_contains_all';
    } else {
      pattern = 'title_starts_with';
    }
    this.cart_search_results_controller.update(Item.where(pattern, query, page, 10));
  },
  
  update: function(transaction) {
    $('h2#cart_summary', this.view).html(transaction.countItems() + ' item(s): ' + Currency.pretty(transaction.subtotal()));
  },
  
  showLinesSection: function() {
    this.cart_section_controller.showSection(0);
  },
  
  showFormSection: function() {
    this.cart_section_controller.showSection(1);
  },
  
  showSearchSection: function() {
    this.cart_section_controller.showSection(2);
  },
  
  addLines: function(lines) {
    this.cart_lines_controller.add(lines);
  },
  
  setLines: function(lines) {
    this.notifyObservers(lines);
  }
});