//= require "../view_controller"
//= require "../../sectionable"
//= require "../../models/transaction"
//= require "../../models/customer"
//= require "transactions_payment_line_controller"
//= require "transactions_payment_cash_controller"
//= require "transactions_payment_store_credit_controller"
//= require "transactions_payment_payout_controller"
//= require "transactions_payment_scale_controller"

var TransactionsPaymentController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    this.payments = [];
    
    this.scale_controller = new TransactionsPaymentScaleController('ul#transactions_payment_scale_container');
    this.store_credit_controller = new TransactionsPaymentStoreCreditController('div#transactions_payment_store_credit');
    this.gift_card_controller = new TransactionsPaymentLineController('div#transactions_payment_gift_card');
    this.check_controller = new TransactionsPaymentLineController('div#transactions_payment_check');
    this.credit_card_controller = new TransactionsPaymentLineController('div#transactions_payment_credit_card');
    this.cash_controller = new TransactionsPaymentCashController('div#transactions_payment_cash');
    this.store_credit_payout_controller = new TransactionsPaymentPayoutController('li#transactions_payment_scale_store_credit');
    this.cash_payout_controller = new TransactionsPaymentPayoutController('li#transactions_payment_scale_cash');
    this.store_credit_controller.addObserver(this.updatePayment, this);
    this.gift_card_controller.addObserver(this.updatePayment, this);
    this.check_controller.addObserver(this.updatePayment, this);
    this.credit_card_controller.addObserver(this.updatePayment, this);
    this.cash_controller.addObserver(this.updatePayment, this);
    
    this.reset();
    this.enableBuyFromStore();
  },
  
  reset: function() {
    this.resetSummary();
    this.resetPaymentFields();
  },
  
  resetSummary: function() {
    $('div#transactions_payment_summary span#transactions_payment_cart_items', this.view).html('0 item(s) in cart');
    $('div#transactions_payment_summary span#transactions_payment_cart_subtotal', this.view).html('$0.00');
    $('div#transactions_payment_summary span#transactions_payment_summary_tax', this.view).html('Tax: $0.00');
    $('div#transactions_payment_summary span#transactions_payment_summary_total', this.view).html('Total: $0.00');
    $('div#transactions_payment_action span#transactions_payment_change', this.view).html('Change Due: $0.00');
  },
  
  resetPaymentFields: function() {
    this.store_credit_controller.reset();
    this.gift_card_controller.reset();
    this.check_controller.reset();
    this.credit_card_controller.reset();
    this.cash_controller.reset();
    this.store_credit_payout_controller.reset();
    this.cash_payout_controller.reset();
  },
  
  enablePaymentFields: function() {
    this.gift_card_controller.enable();
    this.check_controller.enable();
    this.credit_card_controller.enable();
    this.cash_controller.enable();
    this.store_credit_payout_controller.disable();
    this.cash_payout_controller.disable();
  },
  
  disablePaymentFields: function() {
    this.store_credit_controller.disable();
    this.gift_card_controller.disable();
    this.check_controller.disable();
    this.credit_card_controller.disable();
    this.cash_controller.disable();
    this.store_credit_payout_controller.enable();
    this.cash_payout_controller.enable();
  },
  
  update: function(transaction) {
    this.reset();
    amount_due = transaction.amountDue();
    payments = transaction.payments;
    
    this.store_credit_controller.update(0, transaction.subtotal());
    this.store_credit_payout_controller.update(0, transaction.subtotal());
    this.cash_controller.update(0, amount_due);
    this.cash_payout_controller.update(0, amount_due);
    this.gift_card_controller.update(0, amount_due);
    this.credit_card_controller.update(0, amount_due);
    this.check_controller.update(0, amount_due);
    
    if(payments != undefined) {
      if(payments.length > 0) {
        this.payments = payments;
        for(payment in payments) {
          switch(payments[payment].form) {
            case 'store_credit':
              this.store_credit_controller.update(payments[payment].amount, transaction.subtotal());
              this.store_credit_payout_controller.update(payments[payment].amount, transaction.subtotal());
              break;
            case 'cash':
              this.cash_controller.update(payments[payment].amount, amount_due);
              this.cash_payout_controller.update(payments[payment].amount, amount_due);
              break;
            case 'gift_card':
              this.gift_card_controller.update(payments[payment].amount, amount_due);
              break;
            case 'credit_card':
              this.credit_card_controller.update(payments[payment].amount, amount_due);
              break;
            case 'check':
              this.check_controller.update(payments[payment].amount, amount_due);
              break;
          }
        }
      } else {
        this.payments = [];
      }
    }
    this.store_credit_controller.setCustomer(transaction.customer());
    this.updateSummary(transaction);
    
    if(transaction.total() >= 0) {
      this.enableBuyFromStore();
    } else {
      this.enableSellToStore();
    }
  },
  
  updatePayment: function(updated_payment) {
    found = false;
    for(payment in this.payments) {
      if(this.payments[payment].form == updated_payment.form) {
        this.payments[payment] = updated_payment;
        found = true;
      }
    }
    if(!found) {
      this.payments.push(updated_payment);
    }
    this.notifyObservers(this.payments);
  },
  
  updateSummary: function(transaction) {
    amount_due = transaction.amountDue();
    $('div#transactions_payment_cart span#transactions_payment_cart_items', this.view).html(transaction.countItems() + ' item(s) in cart');
    $('div#transactions_payment_cart span#transactions_payment_cart_subtotal', this.view).html(Currency.pretty(transaction.subtotal()));
    $('div#transactions_payment_summary span#transactions_payment_summary_taxable_subtotal', this.view).html(Currency.pretty(transaction.purchaseSubtotal()));
    $('div#transactions_payment_summary span#transactions_payment_summary_tax', this.view).html('Tax: ' + Currency.pretty(transaction.tax()));
    $('div#transactions_payment_summary span#transactions_payment_summary_total', this.view).html('Total: ' + Currency.pretty(transaction.total()));
    if(amount_due >= 0) {
      $('div#transactions_payment_action span#transactions_payment_change', this.view).html('Amount Due: ' + Currency.pretty(amount_due));
    } else {
      $('div#transactions_payment_action span#transactions_payment_change', this.view).html('Change Due: ' + Currency.pretty(Math.abs(amount_due)));
    }
  },
  
  enableBuyFromStore: function() {
    this.enablePaymentFields();
    this.scale_controller.view.hide();
  },
  
  enableSellToStore: function() {
    this.disablePaymentFields();
    this.scale_controller.view.show();
  }
});