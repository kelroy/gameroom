//= require "view_controller"
//= require "currency"

var SummaryController = new JS.Class(ViewController, {
  
  reset: function() {
    this.setCustomer('Select a customer...');
    this.setItemCount(0);
    this.setTotal(0);
    this.view.show();
  },

  update: function(transaction) {
    // Set customer
    // Set items
    this.setTotal(transaction.total);
  },
  
  setItemCount: function(count) {
    $('h2#summary_item_count', this.view).html(count + ' item(s)');
  },
  
  setCustomer: function(customer) {
    $('h2#summary_customer', this.view).html(customer);
  },
  
  setTotal: function(total) {
    $('h2#summary_total', this.view).html(Currency.pretty(total));
  }
});