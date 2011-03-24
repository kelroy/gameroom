//= require "customer_table_controller"
//= require "../../models/customer"

var CustomerSearchResultsController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.customer_table_controller = new CustomerTableController($('table', this.view));
    this.customer_table_controller.addObserver(this.onCustomer, this);
  },
  
  reset: function() {
    this.customer_table_controller.reset();
  },
  
  search: function(query, page) {
    if(page == undefined || page == null) {
      page = 1;
    }
    controller = this;
    Customer.search(query, page, function(customers) {
      customers_results = [];
      for(customer in customers) {
        customers_results.push(new Customer(customers[customer].customer));
      }
      controller.customer_table_controller.update(customers_results);
    });
  },
  
  onCustomer: function(id) {
    controller = this;
    Customer.find(id, function(customer) {
      if(customer != null) {
        controller.notifyObservers(new Customer(customer));
      }
    });
  }
});