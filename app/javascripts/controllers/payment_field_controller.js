//= require "view_controller"

var PaymentFieldController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.enabled = false;
    this.amount_due = 0;
    $('input.payment', this.view).bind('change', {instance: this}, this.onChange);
  },
  
  reset: function() {
    $('input.payment', this.view).val(null);
  },
  
  enable: function() {
    this.enabled = true;
    $('input.payment', this.view).attr('disabled', false);
  },
  
  disable: function() {
    this.enabled = false;
    $('input.payment', this.view).attr('disabled', true);
  },
  
  set: function(amount) {
    console.log(amount);
    $('input.payment', this.view).val(Math.abs(amount));
    $('input.payment', this.view).trigger('change');
  },
  
  update: function(amount, amount_due) {
    this.amount_due = amount_due;

    if(amount > 0) {
      $('input.payment', this.view).val(Currency.format(amount));
    } else {
      $('input.payment', this.view).val(null);
    }
  },
  
  onChange: function(event) {
    if(!isNaN($(this).val())) {
      event.data.instance.notifyObservers(new Payment($(this).attr('data-payment-form'), Currency.toPennies(Math.abs($(this).val()))));
    } else {
      $(this).val(null);
    }
  }
});