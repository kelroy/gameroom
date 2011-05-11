//= require "../view_controller"

var TransactionsPaymentFieldController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.enabled = false;
    this.amount_due = 0;
    $('input.payment', this.view).bind('change', {instance: this}, this.onChange);
  },
  
  reset: function() {
    this.amount_due = 0;
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
    $('input.payment', this.view).val(Math.abs(amount));
    $('input.payment', this.view).trigger('change');
  },
  
  update: function(amount, amount_due) {
    if(amount_due > 0) {
      this.amount_due = amount_due;
    } else {
      this.amount_due = 0;
    }

    if(amount > 0) {
      $('input.payment', this.view).val(Currency.format(amount));
    } else {
      $('input.payment', this.view).val(null);
    }
  },
  
  onChange: function(event) {
    if(!isNaN($(this).val())) {
      event.data.instance.notifyObservers({form: $(this).attr('data-payment-form'), amount: Currency.toPennies(Math.abs($(this).val()))});
    } else {
      $(this).val(null);
    }
  }
});