//= require "../../sectionable"
//= require "../../models/customer"
//= require "transactions_customer_table_controller"

var TransactionsCustomerSearchResultsController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    this.customer_table_controller = new TransactionsCustomerTableController($('table', this.view));
    this.customer_table_controller.addObserver(this.onPerson, this);
  },
  
  reset: function() {
    this.customer_table_controller.reset();
  },
  
  update: function(results) {
    if(results.length > 0) {
      $('h2#customer_search_results_notice').hide();
    } else {
      $('h2#customer_search_results_notice').show();
    }
    this.customer_table_controller.update(results);
  },
  
  onPerson: function(id) {
    this.notifyObservers(Person.find(id).customer());
  }
});