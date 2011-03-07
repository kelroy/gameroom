//= require "view_controller"
//= require "../models/transaction"
//= require "../models/payment"

var ScaleController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.total = 0;
    this.payment = new Payment();
    this.transaction = new Transaction();
    this.setTransaction(new Transaction());
    $('input#payment_action_credit_value', view).bind('change', {instance: this}, this.onCreditChange);
    $('input#payment_action_cash_value', view).bind('change', {instance: this}, this.onCashChange);
  },
  
  reset: function() {
    $('input#payment_action_credit_value', this.view).val(Currency.format(0));
    $('input#payment_action_cash_value', this.view).val(Currency.format(0));
  },
  
  enable: function() {
    this.view.show();
  },
  
  disable: function() {
    this.view.hide();
  },
  
  onCreditChange: function(event) {
    credit = Currency.toPennies(parseInt($(this).val())) * -1;
    if(credit < event.data.instance.transaction.total()) {
      credit = event.data.instance.transaction.total();
    }
    event.data.instance.payment.amount = credit;
    event.data.instance.notifyObservers(event.data.instance.payment);
    event.preventDefault();
  },
  
  onCashChange: function(event) {
    this.notifyObservers(this.payment);
    event.preventDefault();
  },
  
  setTransaction: function(transaction) {
    new_total = false;
    if(transaction.total() != this.total) {
      this.total = transaction.total();
      new_total = true;
    }
    this.transaction = transaction;
    
    if(this.transaction.total() < 0) {
      credit_offset_payment = null;
      for(payment in this.transaction.payments) {
        if(this.transaction.payments[payment].form == 'store_credit') {
          credit_offset_payment = this.transaction.payments[payment];
        }
      }
      
      if(credit_offset_payment == null) {
        this.payment = new Payment();
        this.payment.form = 'store_credit';
        this.payment.amount = this.transaction.total();
        this.notifyObservers(this.payment);
      } else {
        this.payment = credit_offset_payment;
        if(new_total) {
          this.payment.amount = transaction.total();
          this.notifyObservers(this.payment);
        }
      }
      
      $('input#payment_action_credit_value', this.view).val(Currency.format(Math.abs(this.payment.amount)));
    } else {
      for(payment in this.transaction.payments) {
        if(this.transaction.payments[payment].form == 'store_credit' && this.transaction.payments[payment].amount < 0) {
          this.transaction.payments[payment].amount = 0;
          this.notifyObservers(this.transaction.payments[payment]);
        }
      }
    }
  }
  
});