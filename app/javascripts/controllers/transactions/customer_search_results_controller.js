//= require "customer_table_controller"
//= require "../../models/customer"

var CustomerSearchResultsController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.customer_table_controller = new CustomerTableController($('table', this.view));
    this.customer_table_controller.addObserver(this.onPerson, this);
  },
  
  reset: function() {
    this.customer_table_controller.reset();
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
    this.customer_table_controller.update(Person.search(pattern, query.split(' '), page, 10));
  },
  
  onPerson: function(id) {
    this.notifyObservers(Person.find(id).customer());
  }
});