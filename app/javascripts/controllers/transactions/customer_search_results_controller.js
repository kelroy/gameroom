//= require "../../sectionable"
//= require "customer_table_controller"
//= require "../../models/customer"

var CustomerSearchResultsController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    this.customer_table_controller = new CustomerTableController($('table', this.view));
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