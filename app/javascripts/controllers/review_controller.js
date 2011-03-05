//= require "view_controller"
//= require "../currency"
//= require "../string"

var ReviewController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    $('input#receipt_quantity', view).bind('change', {instance: this}, this.onReceiptQuantityChanged);
    this.payment_row = $('div#review_summary table > tbody > tr#payment', view).detach();
    this.item_row = $('div#review_list table > tbody > tr', view).detach();
    this.reset();
    this.callSuper();
  },
  
  reset: function() {
    $('input#receipt_quantity', this.view).val(1);
    $('div#review_summary table > tbody > tr#subtotal > td', this.view).eq(1).html(Currency.pretty(0));
    $('div#review_summary table > tbody > tr#tax > td', this.view).eq(1).html(Currency.pretty(0));
    $('div#review_summary table > tbody > tr#total > td', this.view).eq(1).html(Currency.pretty(0));
  },
  
  update: function(transaction) {
    //alert(transaction.payments.length);
    $('div#review_summary table > tbody > tr#payment', this.view).remove()
    $('div#review_list table > tbody > tr', this.view).remove();
    
    for(item in transaction.items) {
      new_item_row = this.item_row.clone();
      $('td.quantity', new_item_row).html(transaction.items[item].quantity);
      $('td.title', new_item_row).html(transaction.items[item].title);
      $('td.description', new_item_row).html(transaction.items[item].description);
      $('td.sku', new_item_row).html(transaction.items[item].sku);
      $('td.price', new_item_row).html(Currency.pretty(transaction.items[item].price));
      $('td.subtotal', new_item_row).html(Currency.pretty(transaction.items[item].price * transaction.items[item].quantity));
      $('div#review_list table tbody').append(new_item_row);
    }
    for(payment in transaction.payments) {
      new_payment_row = this.payment_row.clone();
      $('td', new_payment_row).eq(0).html(String.capitalize(transaction.payments[payment].type.replace('_', ' ')));
      $('td', new_payment_row).eq(1).html(Currency.pretty(transaction.payments[payment].amount));
      $('div#review_summary table tbody tr#change').before(new_payment_row);
    }
    $('div#review_summary table > tbody > tr#subtotal > td', this.view).eq(1).html(Currency.pretty(transaction.subtotal));
    $('div#review_summary table > tbody > tr#tax > td', this.view).eq(1).html(Currency.pretty(transaction.tax));
    $('div#review_summary table > tbody > tr#total > td', this.view).eq(1).html(Currency.pretty(transaction.total));
    $('div#review_summary table > tbody > tr#change > td', this.view).eq(1).html(Currency.pretty(transaction.change));
  },
  
  onReceiptQuantityChanged: function(event) {
    quantity = $(this).val();
    if(!isNaN(quantity)) {
      event.data.instance.notifyObservers(quantity);
    } else {
      $(this).val(1);
      event.data.instance.notifyObservers(1);
    }
  },
  
  setReceiptQuantity: function(quantity) {
    this.notifyObservers(quantity);
  }
});