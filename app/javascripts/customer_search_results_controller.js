//= require "customer_table_controller"
//= require "customer"

var CustomerSearchResultsController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.customer_table_controller = new CustomerTableController($('table', this.view));
    this.customer_table_controller.addObserver(this.onCustomer, this);
  },
  
  search: function(query) {
    this.customer_table_controller.update(Customer.search(query));
  },
  
  onCustomer: function(id) {
    this.notifyObservers(Customer.find(id));
  }
});