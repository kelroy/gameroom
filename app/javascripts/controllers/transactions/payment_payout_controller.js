//= require "payment_field_controller"

var PaymentPayoutController = new JS.Class(PaymentFieldController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
  },
  
  update: function(amount) {
    if(amount < 0) {
      $('input.payment', this.view).val(Currency.format(amount * -1));
    } else {
      $('input.payment', this.view).val(null);
    }
  },
  
  onChange: function(event) {
    if(!isNaN($(this).val())) {
      event.data.instance.notifyObservers(new Payment({form: $(this).attr('data-payment-form'), amount: Currency.toPennies(Math.abs($(this).val())) * -1}));
    } else {
      $(this).val(null);
    }
  }
});