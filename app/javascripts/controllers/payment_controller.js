//= require "view_controller"
//= require "payment_line_controller"
//= require "store_credit_controller"
//= require "scale_controller"
//= require "../models/transaction"
//= require "../models/customer"

var PaymentController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.transaction = new Transaction();
    this.scale_controller = new ScaleController('ul#payment_scale_container');
    this.store_credit_controller = new StoreCreditController('div#payment_store_credit');
    this.gift_card_controller = new PaymentLineController('div#payment_gift_card');
    this.check_controller = new PaymentLineController('div#payment_check');
    this.credit_card_controller = new PaymentLineController('div#payment_credit_card');
    this.cash_controller = new PaymentLineController('div#payment_cash');
    this.scale_controller.addObserver(this.updatePayments, this);
    this.store_credit_controller.addObserver(this.setPayment, this);
    this.gift_card_controller.addObserver(this.setPayment, this);
    this.check_controller.addObserver(this.setPayment, this);
    this.credit_card_controller.addObserver(this.setPayment, this);
    this.cash_controller.addObserver(this.setPayment, this);
    this.reset();
    this.callSuper();
  },
  
  reset: function() {
    this.resetSummary();
    this.resetPaymentFields();
    this.resetScaleFields();
    this.enableBuyFromStore();
    this.notifyObservers(this.payments);
  },
  
  resetSummary: function() {
    $('div#payment_summary span#payment_summary_items', this.view).html('0 item(s) in cart');
    $('div#payment_summary span#payment_summary_subtotal', this.view).html('$0.00 ($0.00)');
    $('div#payment_summary span#payment_summary_tax', this.view).html('Tax: $0.00');
    $('div#payment_summary span#payment_summary_total', this.view).html('Total: $0.00');
    $('div#payment_action span#payment_change', this.view).html('Change Due: $0.00');
  },
  
  resetPaymentFields: function() {
    this.store_credit_controller.reset();
    this.gift_card_controller.reset();
    this.check_controller.reset();
    this.credit_card_controller.reset();
    this.cash_controller.reset();
  },
  
  resetScaleFields: function() {
    this.scale_controller.reset();
  },
  
  findPayment: function(form) {
    payment = null;
    for(p in this.payments) {
      if(this.payments[p].form == form) {
        payment = this.payments[p];
      }
    }
    return payment;
  },
  
  setPayment: function(payment) {
    existing_payment = this.findPayment(payment.form);
    if(existing_payment != null) {
      this.removePayment(existing_payment.form);
    }
    if(payment.amount != null && payment.amount != 0) {
      this.payments.push(payment);
    }
    this.notifyObservers(this.payments);
  },
  
  removePayment: function(form) {
    for(p in this.payments) {
      if(this.payments[p].form == form) {
        this.payments.splice(p, 1);
        return true;
      }
    }
    return false;
  },
  
  updateOffsets: function() {
    this.notifyObservers(this.payments);
  },
  
  enablePaymentFields: function() {
    this.store_credit_controller.enable();
    this.gift_card_controller.enable();
    this.check_controller.enable();
    this.credit_card_controller.enable();
    this.cash_controller.enable();
  },
  
  disablePaymentFields: function() {
    this.store_credit_controller.disable();
    this.gift_card_controller.disable();
    this.check_controller.disable();
    this.credit_card_controller.disable();
    this.cash_controller.disable();
  },
  
  update: function(transaction) {
    this.transaction = transaction;
    this.store_credit_controller.setTransaction(transaction);
    this.scale_controller.setTransaction(transaction);
    this.updateSummary(transaction);
    if(transaction.total() > 0) {
      this.enableBuyFromStore();
    } else {
      this.enableSellToStore();
    }
  },
  
  updateSummary: function(transaction) {
    if(this.store_credit_offset_payment.amount == 0 && transaction.total() < 0) {
      this.store_credit_offset_payment.amount = transaction.total();
      this.payments.push(this.store_credit_offset_payment);
      this.payments.push(this.cash_offset_payment);
      this.scale_controller.setCredit(transaction.total());
      console.log(this.payments);
      this.notifyObservers(this.payments);
    }
    $('div#payment_summary span#payment_summary_items', this.view).html(transaction.countItems() + ' item(s) in cart');
    $('div#payment_summary span#payment_summary_subtotal', this.view).html(Currency.pretty(transaction.subtotal()));
    $('div#payment_summary span#payment_summary_tax', this.view).html('Tax: ' + Currency.pretty(transaction.tax()));
    $('div#payment_summary span#payment_summary_total', this.view).html('Total: ' + Currency.pretty(transaction.total()));
    if(transaction.change() >= 0) {
      $('div#payment_action span#payment_change', this.view).html('Change Due: ' + Currency.pretty(transaction.change()));
    } else {
      $('div#payment_action span#payment_change', this.view).html('Amount Due: ' + Currency.pretty(Math.abs(transaction.change())));
    }
  },
  
  enableBuyFromStore: function() {
    this.enablePaymentFields();
    this.scale_controller.disable();
  },
  
  enableSellToStore: function() {
    this.disablePaymentFields();
    this.resetPaymentFields();
    this.payments = [];
    this.scale_controller.enable();
  }
});