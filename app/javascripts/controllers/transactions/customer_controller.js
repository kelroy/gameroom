//= require "../../sectionable"
//= require "../view_controller"
//= require "../search_controller"
//= require "customer_form_controller"
//= require "customer_search_results_controller"

var CustomerController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    this.customer_review_controller = new CustomerReviewController('div#customer_review');
    this.customer_form_controller = new CustomerFormController('div#customer_form');
    this.customer_search_controller = new SearchController('div#customer_search');
    this.customer_search_results_controller = new CustomerSearchResultsController('div#customer_search_results');
    this.customer_section_controller = new SectionController('ul#customer_nav', [
      this.customer_review_controller,
      this.customer_form_controller,
      this.customer_search_results_controller
    ]);
    this.customer_search_controller.addObserver(this.search, this);
    this.customer_search_controller.addObserver(this.showSearchController, this);
    this.customer_search_results_controller.addObserver(this.setCustomer, this);
    this.customer_form_controller.addObserver(this.setCustomer, this);
    
    this.reset();
  },
  
  reset: function() {
    this.customer_review_controller.reset();
    this.customer_form_controller.reset();
    this.customer_search_controller.reset();
    this.customer_search_results_controller.reset();
    this.customer_section_controller.reset();
    this.showReviewSection();
  },
  
  search: function(query, page) {
    if(page == undefined || page == null) {
      page = 1;
    }
    if(query.length > 1) {
      pattern = 'first_name_or_last_name_contains_any';
    } else {
      pattern = 'last_name_starts_with';
    }
    this.customer_search_results_controller.update(Person.search(pattern, query.split(' '), page, 10, this.customer_search_controller.showLoading, this.customer_search_controller.hideLoading));
  },
  
  showReviewSection: function() {
    this.customer_section_controller.showController(0);
  },
  
  showFormController: function() {
    this.customer_section_controller.showController(1);
  },
  
  showSearchController: function(query) {
    if(query) {
      this.customer_section_controller.showController(2);
    }
  },
  
  setCustomer: function(customer) {
    this.customer_review_controller.update(customer);
    this.customer_form_controller.update(customer);
    this.showReviewSection();
    this.notifyObservers(customer);
  }
});