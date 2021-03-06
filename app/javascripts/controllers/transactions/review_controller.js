//= require "../../sectionable"
//= require "../view_controller"
//= require "../../currency"
//= require "../../string"

var ReviewController = new JS.Class(ViewController, {
  include: Sectionable,
  
  initialize: function(view) {
    this.callSuper();
    this.payment_row = $('div#review_summary table > tbody > tr#payment', view).detach();
    this.line = $('div#review_lines table > tbody > tr', view).detach();
  },
  
  reset: function() {
    $('input#receipt_quantity', this.view).val(1);
    $('div#review_summary table > tbody > tr#subtotal > td', this.view).eq(1).html(Currency.pretty(0));
    $('div#review_summary table > tbody > tr#tax > td', this.view).eq(1).html(Currency.pretty(0));
    $('div#review_summary table > tbody > tr#total > td', this.view).eq(1).html(Currency.pretty(0));
    $('div#review_summary table > tbody > tr#change > td', this.view).eq(1).html(Currency.pretty(0));
    $('div#review_summary table > tbody > tr#payment', this.view).remove();
    $('div#review_lines table > tbody > tr', this.view).remove();
    $('h2#review_customer', this.view).html("No customer");
  },
  
  update: function(transaction) {
    
    customer = transaction.customer();
    if(customer != undefined) {
      person = customer.person();
      if(person != undefined) {
        $('h2#review_customer', this.view).html(person.first_name + ' ' + person.last_name);
      } else {
        $('h2#review_customer', this.view).empty();
      }
    } else {
      $('h2#review_customer', this.view).html("No customer");
    }
    
    $('div#review_summary table > tbody > tr#payment', this.view).remove();
    $('div#review_lines table > tbody > tr', this.view).remove();
    
    lines = transaction.lines();
    for(line in lines) {
      var new_line = this.line.clone();
      if(lines[line].description == null || lines[line].description == undefined) {
        lines[line].description = '';
      }
      
      $('td.quantity', new_line).html(lines[line].quantity);
      $('td.title', new_line).html(lines[line].title);
      $('td.description', new_line).html(lines[line].description.truncate(50));
      $('td.subtotal', new_line).html(Currency.pretty(lines[line].subtotal()));
      $('div#review_lines table tbody').append(new_line);
    }
    payments = transaction.payments();
    for(payment in payments) {
      if(payments[payment].amount != 0) {
        var new_payment_row = this.payment_row.clone();
        $('td', new_payment_row).eq(0).html(payments[payment].form.replace('_', ' ').capitalize());
        $('td', new_payment_row).eq(1).html(Currency.pretty(payments[payment].amount));
        $('div#review_summary table tbody tr#change').before(new_payment_row);
      }
    }
    $('div#review_summary table > tbody > tr#subtotal > td', this.view).eq(1).html(Currency.pretty(transaction.subtotal()));
    $('div#review_summary table > tbody > tr#tax > td', this.view).eq(1).html(Currency.pretty(transaction.tax()));
    $('div#review_summary table > tbody > tr#total > td', this.view).eq(1).html(Currency.pretty(transaction.total()));
    amount_due = transaction.amountDue();
    if(amount_due >= 0) {
      $('div#review_summary table > tbody > tr#change > td', this.view).eq(0).html('Amount Due');
      $('div#review_summary table > tbody > tr#change > td', this.view).eq(1).html(Currency.pretty(amount_due));
    } else {
      $('div#review_summary table > tbody > tr#change > td', this.view).eq(0).html('Change Due');
      $('div#review_summary table > tbody > tr#change > td', this.view).eq(1).html(Currency.pretty(Math.abs(amount_due)));
    }
  }
});