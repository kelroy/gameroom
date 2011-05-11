//= require "../view_controller"
//= require "../../currency"

var TransactionsSummaryController = new JS.Class(ViewController, {
  
  reset: function() {
    this.setCustomer(new Customer());
    this.setItemCount(0);
    this.setTotal(0);
    this.view.show();
  },

  update: function(transaction) {
    customer = transaction.customer();
    if(customer != undefined) {
      this.setCustomer(customer);
    }
    this.setItemCount(transaction.countItems());
    this.setTotal(transaction.total());
  },
  
  setItemCount: function(count) {
    $('h2#transactions_summary_item_count', this.view).html(count + ' item(s)');
  },
  
  setCustomer: function(customer) {
    if(customer.id == null) {
      $('h2#transactions_summary_customer', this.view).html("No customer");
    } else {
      person = customer.person();
      if(person != undefined) {
        $('h2#transactions_summary_customer', this.view).html(person.first_name + ' ' + person.last_name);
      } else {
        $('h2#transactions_summary_customer', this.view).empty();
      }
    }
  },
  
  setTotal: function(total) {
    $('h2#transactions_summary_total', this.view).html(Currency.pretty(total));
  }
});