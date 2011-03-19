//= require "payment_line_controller"
//= require "../../models/customer"

var PaymentStoreCreditController = new JS.Class(PaymentLineController, {
  
  initialize: function(view) {
    this.callSuper();
    this.customer = null;
  },
  
  reset: function() {
    this.customer = new Customer({});
    this.callSuper();
  },
  
  enable: function() {
    if(this.customer.id != null) {
      this.callSuper();
    } else {
      this.disable();
    }
  },
  
  update: function(amount, amount_due, customer) {
    if(customer != undefined) {
      if(customer.id != null) {
        this.customer = customer;
        if(this.customer.person != null) {
          $('div#payment_store_credit span#payment_customer').html(this.customer.person.first_name + ' ' + this.customer.person.last_name + ': ' + Currency.pretty(this.customer.credit));
        } else {
          $('div#payment_store_credit span#payment_customer').empty();
        }
        this.enable();
      }
    } else {
      $('div#payment_store_credit span#payment_customer').empty();
    }
    this.callSuper(amount, amount_due);
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
      event.data.instance.notifyObservers(new Payment({form: $(this).attr('data-payment-form'), amount: Currency.toPennies(Math.abs(amount))}));
    } else {
      $(this).val(null);
    }
  }
  
});