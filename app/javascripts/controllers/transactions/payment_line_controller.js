//= require "payment_field_controller"

var PaymentLineController = new JS.Class(PaymentFieldController, {
  
  initialize: function(view) {
    this.callSuper();
    this.enabled = false;
    $('a.clear', this.view).bind('click', {instance: this}, this.onClear);
    $('a.amount_due', this.view).bind('click', {instance: this}, this.onAmountDue);
    $('form', this.view).submit(function(event) {
      event.preventDefault();
    });
  },
  
  enable: function() {
    this.enabled = true;
    this.callSuper();
  },
  
  disable: function() {
    this.enabled = true;
    this.callSuper();
  },
  
  onAmountDue: function(event) {
    if(event.data.instance.amount_due != 0 && event.data.instance.enabled) {
      input = $('input.payment', event.data.instance.view);
      input.val(Currency.format(event.data.instance.amount_due));
      input.trigger('change');
    }
    event.preventDefault();
  },
  
  onClear: function(event) {
    if(event.data.instance.enabled) {
      input = $('input.payment', event.data.instance.view);
      input.val(null);
      input.trigger('change');
    }
    event.preventDefault();
  }
});