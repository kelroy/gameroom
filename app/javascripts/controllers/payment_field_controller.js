//= require "view_controller"

var PaymentFieldController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.disable();
    this.reset();
    this.due = 0;
    $('input.payment', this.view).bind('change', {instance: this}, this.onChange);
  },
  
  reset: function() {
    this.due = 0;
    $('input.payment', this.view).val(null);
  },
  
  enable: function() {
    $('input.payment', this.view).attr('disabled', false);
  },
  
  disable: function() {
    $('input.payment', this.view).attr('disabled', true);
  },
  
  update: function(due, amount) {
    this.due = due;
    
    if(amount > 0) {
      $('input.payment', this.view).val(Currency.format(amount));
    } else {
      $('input.payment', this.view).val(null);
    }
  },
  
  onChange: function(event) {
    if(!isNaN($(this).val())) {
      payment = new Payment($(this).attr('data-payment-form'), Currency.toPennies($(this).val()));
      event.data.instance.notifyObservers(payment);
    } else {
      $(this).val(null);
    }
  }
});