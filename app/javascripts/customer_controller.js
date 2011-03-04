//= require "view_controller"
//= require "customer_form_controller"
//= require "customer_search_results_controller"
//= require "customer_search_controller"
//= require "customer"

var CustomerController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.customer = new Customer();
    this.customer_form_controller = new CustomerFormController('div#customer_form');
    this.customer_search_controller = new CustomerSearchController('div#customer_search');
    this.customer_search_results_controller = new CustomerSearchResultsController('div#customer_search_results');
    this.customer_page_controller = new PageController('ul#customer_nav', [
      this.customer_form_controller.view,
      this.customer_search_results_controller.view
    ]);
    this.customer_search_controller.addObserver(this.customer_search_results_controller.search, this.customer_search_results_controller);
    this.customer_search_controller.addObserver(this.showSearchSection, this);
    
    this.reset();
    this.callSuper();
  },
  
  reset: function() {
    this.customer_form_controller.reset();
    this.customer_search_controller.reset();
    this.customer_search_results_controller.reset();
    this.customer_page_controller.reset();
  },
  
  showSearchSection: function() {
    this.customer_page_controller.showSection(1);
  },
  
  setCustomer: function(customer) {
    this.customer = customer;
    this.notifyObservers(customer);
  }
});