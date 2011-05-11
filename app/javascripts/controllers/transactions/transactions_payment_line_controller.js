//= require "transactions_payment_field_controller"

var TransactionsPaymentLineController = new JS.Class(TransactionsPaymentFieldController, {
  
  initialize: function(view) {
    this.callSuper();
    $('a.clear', this.view).bind('click', {instance: this}, this.onClear);
    $('a.amount_due', this.view).bind('click', {instance: this}, this.onAmountDue);
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