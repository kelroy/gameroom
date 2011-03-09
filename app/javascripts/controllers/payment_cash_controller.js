//= require "view_controller"

var PaymentCashController = new JS.Class(PaymentLineController, {
  
  initialize: function(view) {
    this.callSuper();
    $('a.denomination', this.view).bind('click', {instance: this}, this.onDenomination);
  },
  
  onDenomination: function(event) {
    input = $('input.payment', event.data.instance.view);
    amount = parseFloat($(this).attr('data-denomination'));
    current_amount = parseFloat(input.val());
    if(isNaN(current_amount)) {
      current_amount = 0;
    }
    input.val(Currency.format(Currency.toPennies(amount + current_amount)));
    input.trigger('change');
    event.preventDefault();
  }
});