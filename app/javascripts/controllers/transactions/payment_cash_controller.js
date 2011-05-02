//= require "../view_controller"

var PaymentCashController = new JS.Class(PaymentLineController, {
  
  initialize: function(view) {
    this.callSuper();
    $('a.denomination', this.view).bind('click', {instance: this}, this.onDenomination);
    $('a.closest', this.view).bind('click', {instance: this}, this.onClosest);
  },
  
  onDenomination: function(event) {
    if(event.data.instance.enabled) {
      input = $('input.payment', event.data.instance.view);
      amount = parseFloat($(this).attr('data-denomination'));
      current_amount = parseFloat(input.val());
      if(isNaN(current_amount)) {
        current_amount = 0;
      }
      input.val(Currency.format(Currency.toPennies(amount + current_amount)));
      input.trigger('change');
    }
    event.preventDefault();
  },
  
  onClosest: function(event) {
    if(event.data.instance.enabled) {
      input = $('input.payment', event.data.instance.view);
      current_amount = parseFloat(input.val());
      if(isNaN(current_amount)) {
        amount = event.data.instance.amount_due;
      } else {
        amount = Currency.toPennies(current_amount);
      }
      input.val(Currency.format(event.data.instance._round(amount)));
      input.trigger('change');
    }
    event.preventDefault();
  },
  
  _round: function(amount) {
    if(amount % 100 != 0) {
      return Currency.toPennies(Math.ceil(Currency.format(amount)));
    }
    return amount;
  }
});