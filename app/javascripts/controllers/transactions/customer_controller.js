//= require "../view_controller"
//= require "../search_controller"
//= require "customer_form_controller"
//= require "customer_search_results_controller"

var CustomerController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.customer_review_controller = new CustomerReviewController('div#customer_review');
    this.customer_form_controller = new CustomerFormController('div#customer_form');
    this.customer_search_controller = new SearchController('div#customer_search');
    this.customer_search_results_controller = new CustomerSearchResultsController('div#customer_search_results');
    this.customer_section_controller = new SectionController('ul#customer_nav', [
      this.customer_review_controller.view,
      this.customer_form_controller.view,
      this.customer_search_results_controller.view
    ]);
    this.customer_search_controller.addObserver(this.search, this);
    this.customer_search_controller.addObserver(this.showSearchSection, this);
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
    this.customer_search_results_controller.update(Person.search(pattern, query, page, 10));
  },
  
  showReviewSection: function() {
    this.customer_section_controller.showSection(0);
  },
  
  showFormSection: function() {
    this.customer_section_controller.showSection(1);
  },
  
  showSearchSection: function(query) {
    if(query) {
      this.customer_section_controller.showSection(2);
    }
  },
  
  setCustomer: function(customer) {
    this.customer_review_controller.update(customer);
    this.customer_form_controller.update(customer);
    this.showReviewSection();
    this.notifyObservers(customer);
  }
});