var ScaleController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.setTransaction(new Transaction());
    this.callSuper();
  },
  
  reset: function() {
    $('input.scale', this.view).val(null);
  },
  
  enable: function() {
    this.view.show();
  },
  
  disable: function() {
    this.view.hide();
  },
  
  setTransaction: function(transaction) {
    this.transaction = transaction;
    $('input#payment_action_credit_value', this.view).val(Currency.format(Math.abs(this.transaction.total)));
  }
  
});