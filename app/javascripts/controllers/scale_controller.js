//= require "view_controller"

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
    
    if(transaction.total() < 0) {
      credit_offset_payment = null;
      for(payment in this.transaction.payments) {
        if(this.transaction.payments[payment].form == 'store_credit') {
          credit_offset_payment = this.transaction.payments[payment];
        }
      }
      
      if(credit_offset_payment == null) {
        this.payment = new Payment;
        this.payment.form = 'store_credit';
      } else {
        this.payment = credit_offset_payment;
      }
      
      if(this.payment.amount != transaction.total()) {
        this.payment.amount = transaction.total();
        this.notifyObservers(this.payment);
      }
    } else {
      for(payment in this.transaction.payments) {
        if(this.transaction.payments[payment].form == 'store_credit' && this.transaction.payments[payment].amount < 0) {
          this.transaction.payments[payment].amount = 0;
          this.notifyObservers(this.transaction.payments[payment]);
        }
      }
    }
    
    $('input#payment_action_credit_value', this.view).val(Currency.format(Math.abs(this.transaction.total())));
  }
  
});