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
    this.cart_page_controller = new PageController('ul#cart_nav', [
      this.cart_lines_controller.view,
      this.cart_form_controller.view,
      this.cart_search_results_controller.view
    ]);
    this.cart_search_controller.addObserver(this.cart_search_results_controller.search, this.cart_search_results_controller);
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
    this.cart_page_controller.reset();
  },
  
  update: function(transaction) {
    $('h2#cart_summary', this.view).html(transaction.countItems() + ' item(s) in cart: ' + Currency.pretty(transaction.subtotal()));
  },
  
  showLinesSection: function() {
    this.cart_page_controller.showSection(0);
  },
  
  showSearchSection: function() {
    this.cart_page_controller.showSection(2);
  },
  
  addLines: function(lines) {
    this.cart_lines_controller.add(lines);
  },
  
  setLines: function(lines) {
    this.notifyObservers(lines);
  }
});