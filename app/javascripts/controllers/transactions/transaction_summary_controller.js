//= require "../view_controller"
//= require "../../currency"

var TransactionSummaryController = new JS.Class(ViewController, {
  
  reset: function() {
    this.setCustomer(new Customer({}));
    this.setItemCount(0);
    this.setTotal(0);
    this.view.show();
  },

  update: function(transaction) {
    if(transaction.customer != undefined) {
      this.setCustomer(transaction.customer);
    }
    this.setItemCount(transaction.countItems());
    this.setTotal(transaction.total());
  },
  
  setItemCount: function(count) {
    $('h2#summary_item_count', this.view).html(count + ' item(s)');
  },
  
  setCustomer: function(customer) {
    if(customer.id == null) {
      $('h2#summary_customer', this.view).html("No customer");
    } else {
      if(customer.person != null) {
        $('h2#summary_customer', this.view).html(customer.person.first_name + ' ' + customer.person.last_name);
      } else {
        $('h2#summary_customer', this.view).empty();
      }
    }
  },
  
  setTotal: function(total) {
    $('h2#summary_total', this.view).html(Currency.pretty(total));
  }
});