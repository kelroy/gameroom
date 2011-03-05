//= require "view_controller"
//= require "cart_list_controller"
//= require "cart_form_controller"
//= require "cart_search_controller"
//= require "cart_search_results_controller"

var CartController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.cart_items = [];
    this.cart_list_controller = new CartListController('div#cart_list');
    this.cart_form_controller = new CartFormController('div#cart_form');
    this.cart_search_controller = new CartSearchController('div#cart_search');
    this.cart_search_results_controller = new CartSearchResultsController('div#cart_search_results');
    this.cart_page_controller = new PageController('ul#cart_nav', [
      this.cart_list_controller.view,
      this.cart_form_controller.view,
      this.cart_search_results_controller.view
    ]);
    this.cart_search_controller.addObserver(this.cart_search_results_controller.search, this.cart_search_results_controller);
    this.cart_search_controller.addObserver(this.showSearchSection, this);
    this.cart_list_controller.addObserver(this.setItems, this);
    this.cart_search_results_controller.addObserver(this.addItems, this);
    this.cart_form_controller.addObserver(this.addItems, this);
    
    this.reset();
  },
  
  reset: function() {
    this.cart_list_controller.reset();
    this.cart_form_controller.reset();
    this.cart_search_controller.reset();
    this.cart_search_results_controller.reset();
    this.cart_page_controller.reset();
  },
  
  showSearchSection: function() {
    this.cart_page_controller.showSection(2);
  },
  
  addItems: function(items) {
    for(item in items) {
      this.cart_items.push(items[item]);
    }
    this.cart_list_controller.update(this.cart_items); //
    this.notifyObservers(this.cart_items);
  },
  
  setItems: function(items) {
    this.cart_items = items;
    this.notifyObservers(this.cart_items);
  }
});