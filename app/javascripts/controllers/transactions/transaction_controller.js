//= require "../view_controller"
//= require "customer_controller"
//= require "cart_controller"
//= require "payment_controller"
//= require "review_controller"
//= require "transaction_summary_controller"
//= require "transaction_finish_controller"
//= require "transaction_nav_controller"
//= require "../section_controller"
//= require "../../models/till"
//= require "../../models/transaction"
//= require "../../currency"

var TransactionController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function() {
    this.callSuper();
    this.till = null;
    this.user_id = null;
    this.transaction = null;
    
    this.transaction_nav_controller = new TransactionNavController('ul#transaction_nav');
    this.customer_controller = new CustomerController('section#customer');
    this.cart_controller = new CartController('section#cart');
    this.payment_controller = new PaymentController('section#payment');
    this.review_controller = new ReviewController('section#review');
    this.section_controller = new SectionController('ul#transactions_nav', [
      this.cart_controller.view,
      this.customer_controller.view,
      this.payment_controller.view,
      this.review_controller.view
    ]);
    this.summary_controller = new TransactionSummaryController('ul#summary');
    this.finish_controller = new TransactionFinishController('ul#finish');
    
    this.customer_controller.addObserver(this.updateCustomer, this);
    this.cart_controller.addObserver(this.updateCart, this);
    this.payment_controller.addObserver(this.updatePayment, this);
    this.payment_controller.scale_controller.addObserver(this.updatePayoutRatio, this);
    this.payment_controller.store_credit_payout_controller.addObserver(this.updateCreditPayout, this);
    this.payment_controller.cash_payout_controller.addObserver(this.updateCashPayout, this);
    this.finish_controller.addObserver(this.saveTransaction, this);
    
    $('ul#transaction_nav a.reset').bind('click', {instance: this}, this.onReset);
  },
  
  reset: function() {
    this.cart_controller.reset();
    this.payment_controller.reset();
    this.review_controller.reset();
    this.section_controller.reset();
    this.summary_controller.reset();
    this.finish_controller.reset();
    this.customer_controller.reset();
  },
  
  onReset: function(event) {
    event.data.instance.newTransaction(event.data.instance.till, event.data.instance.user_id);
    event.preventDefault();
  },

  updateCustomer: function(customer) {
    if(this.transaction) {
      this.transaction.setCustomer(customer);
      this.notifyControllers(this.transaction);
    }
  },
  
  updateCart: function(lines) {
    if(this.transaction) {
      //this.transaction.setLines(lines);
      //this.notifyControllers(this.transaction);
    }
  },
  
  updatePayment: function(payment) {
    if(this.transaction) {
      this.transaction.updatePayment(payment);
      this.notifyControllers(this.transaction);
    }
  },
  
  updatePayoutRatio: function(ratio) {
    if(this.transaction) {
      this.transaction.updatePayoutRatio(ratio);
      this.notifyControllers(this.transaction);
    }
  },
  
  updateCreditPayout: function(payment) {
    if(this.transaction) {
      this.transaction.updateCreditPayout(payment);
      this.notifyControllers(this.transaction);
    }
  },
  
  updateCashPayout: function(payment) {
    if(this.transaction) {
      this.transaction.updateCashPayout(payment);
      this.notifyControllers(this.transaction);
    }
  },
  
  presentReceipt: function(url) {
    this.receipt_controller.update(url);
    this.receipt_controller.show();
  },
  
  notifyControllers: function(transaction) {
    this.cart_controller.update(transaction);
    this.payment_controller.update(transaction);
    this.review_controller.update(transaction);
    this.summary_controller.update(transaction);
    this.finish_controller.update(transaction);
  },
  
  newTransaction: function(till, user_id) {
    this.reset();
    this.till = till;
    this.user_id = user_id;
    this.setTransaction(new Transaction({user_id: user_id, till_id: till.id, tax_rate: 0.07, complete: false, locked: false}));
  },
  
  setTransaction: function(transaction) {
    this.transaction = transaction;
    this.notifyControllers(transaction);
  },
  
  saveTransaction: function() {
    
    /*valid: function() {
      if(this.subtotal() > 0 && this.amountDue() <= 0) {
        return true;
      } else if(this.subtotal() < 0) {
        if(this.customer != undefined) {
          if(this.customer.valid()) {
            return true;
          }
        }
      } else if(this.countItems() > 0 && this.amountDue() <= 0) {
        return true;
      }
      return false;
    }*/
    controller = this;
    this.transaction.complete = true;
    this.transaction.save(function(transaction) {
      controller.newTransaction(controller.till, controller.user_id);
      controller.notifyObservers('/api/transactions/' + transaction.id + '/receipt');
    });
  }
});