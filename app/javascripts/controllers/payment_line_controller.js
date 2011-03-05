var PaymentLineController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    $('input.payment', view).bind('change', {instance: this}, this.onChange);
    $('a.clear', view).bind('click', {instance: this}, this.onClear);
    this.payment = new Payment();
    this.payment.type = $('input.payment', view).attr('data-payment-type');
    this.disable();
    this.reset();
    this.callSuper();
    this.view.show();
  },
  
  reset: function() {
    $('input.payment', this.view).val(null);
  },
  
  enable: function() {
    $('input.payment', this.view).attr('disabled', false);
  },
  
  disable: function() {
    $('input.payment', this.view).attr('disabled', true);
  },
  
  hideClearButtons: function() {
    $('a.clear', this.view).hide();
  },
  
  showClearButtons: function() {
    $('a.clear', this.view).show();
  },
  
  onClear: function(event) {
    input = $(this).parents('div.payment_line').find('input.payment');
    input.val(null);
    event.data.instance.payment.amount = null;
    event.data.instance.notifyObservers(event.data.instance.payment);
    event.preventDefault();
  },
  
  onChange: function(event) {
    if(!isNaN($(this).val())) {
      event.data.instance.payment.amount = Currency.toPennies($(this).val());
      
      if(event.data.instance.payment.amount != 0) {
        $(this).val(Currency.format(event.data.instance.payment.amount));
      } else {
        $(this).val(null);
      }
      event.data.instance.notifyObservers(event.data.instance.payment);
    } else {
      $(this).val(null);
    }
  }
});