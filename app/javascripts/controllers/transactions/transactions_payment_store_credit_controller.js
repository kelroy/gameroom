//= require "transactions_payment_line_controller"
//= require "../../models/customer"

var TransactionsPaymentStoreCreditController = new JS.Class(TransactionsPaymentLineController, {
  
  initialize: function(view) {
    this.callSuper();
    this.reset();
  },
  
  reset: function() {
    this.callSuper();
    this.disable();
    this.customer = undefined;
    $('div#transactions_payment_store_credit span#transactions_payment_customer').empty();
  },
  
  setCustomer: function(customer) {
    if(customer != undefined) {
      this.customer = customer;
      person = customer.person();
      if(person != undefined) {
        $('div#transactions_payment_store_credit span#transactions_payment_customer').html(person.first_name + ' ' + person.last_name + ': ' + Currency.pretty(customer.credit));
      } else {
        $('div#transactions_payment_store_credit span#transactions_payment_customer').empty();
      }
      this.enable();
    } else {
      this.disable();
    }
  },
  
  onApply: function(event) {
    if(event.data.instance.amount_due != 0 && event.data.instance.enabled) {
      input = $('input.payment', event.data.instance.view);
      if(event.data.instance.amount_due > event.data.instance.customer.credit) {
        input.val(Currency.format(event.data.instance.customer.credit));
      } else {
        input.val(Currency.format(event.data.instance.amount_due));
      }
      input.trigger('change');
    }
    event.preventDefault();
  },
  
  onChange: function(event) {
    amount = $(this).val();
    if(!isNaN(amount)) {
      if(Currency.toPennies(amount) > event.data.instance.customer.credit) {
        amount = Currency.format(event.data.instance.customer.credit);
      }
      if(Currency.toPennies(amount) > event.data.instance.amount_due) {
        amount = Currency.format(event.data.instance.amount_due);
      }
      event.data.instance.notifyObservers({form: $(this).attr('data-payment-form'), amount: Currency.toPennies(Math.abs(amount))});
    } else {
      $(this).val(null);
    }
  }
  
});