//= require "payment_field_controller"

var PaymentPayoutController = new JS.Class(PaymentFieldController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
  },
  
  update: function(amount, amount_due) {
    this.amount_due = amount_due;

    if(amount < 0) {
      $('input.payment', this.view).val(Currency.format(amount * -1));
    } else {
      $('input.payment', this.view).val(null);
    }
  },
  
  onChange: function(event) {
    if(!isNaN($(this).val())) {
      event.data.instance.notifyObservers(new Payment($(this).attr('data-payment-form'), Currency.toPennies(Math.abs($(this).val()) * -1)));
    } else {
      $(this).val(null);
    }
  }
});