//= require "../view_controller"
//= require "transactions_customer_controller"
//= require "transactions_cart_controller"
//= require "transactions_payment_controller"
//= require "transactions_review_controller"
//= require "transactions_summary_controller"
//= require "transactions_finish_controller"
//= require "transactions_nav_controller"
//= require "../section_controller"
//= require "../../models/transaction"
//= require "../../currency"

var TransactionsController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.till_id = null;
    this.user_id = null;
    this.transaction = null;
    
    this.transactions_nav_controller = new TransactionsNavController('ul#transactions_nav');
    this.customer_controller = new TransactionsCustomerController('section#transactions_customer');
    this.cart_controller = new TransactionsCartController('section#transactions_cart');
    this.payment_controller = new TransactionsPaymentController('section#transactions_payment');
    this.review_controller = new TransactionsReviewController('section#transactions_review');
    this.section_controller = new SectionController('ul#transactions_nav', [
      this.cart_controller,
      this.customer_controller,
      this.payment_controller,
      this.review_controller
    ]);
    this.summary_controller = new TransactionsSummaryController('ul#transactions_summary');
    this.finish_controller = new TransactionsFinishController('ul#transactions_finish');
    
    this.customer_controller.addObserver(this.updateCustomer, this);
    this.cart_controller.addObserver(this.updateCart, this);
    this.payment_controller.addObserver(this.updatePayments, this);
    this.payment_controller.scale_controller.addObserver(this.updatePayoutRatio, this);
    this.payment_controller.store_credit_payout_controller.addObserver(this.updateCreditPayout, this);
    this.payment_controller.cash_payout_controller.addObserver(this.updateCashPayout, this);
    this.finish_controller.addObserver(this.saveTransactions, this);
    
    $('ul#transactions_nav a.reset').bind('click', {instance: this}, this.onReset);
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
    event.data.instance.newTransactions(event.data.instance.till_id, event.data.instance.user_id);
    event.preventDefault();
  },
  
  updateUser: function(user) {
    this.user_id = user.id;
  },

  updateCustomer: function(customer) {
    if(this.transaction) {
      this.transaction.setCustomer(customer);
      this.notifyControllers(this.transaction);
    }
  },
  
  updateCart: function(lines) {
    if(this.transaction) {
      this.transaction.setLines(lines);
      if(this.transaction.subtotal() < 0) {
        this.transaction.setPayments([new Payment({form: 'store_credit', amount: this.transaction.subtotal()})]);
      } else {
        this.transaction.setPayments([]);
      }
      this.notifyControllers(this.transaction);
    }
  },
  
  updatePayments: function(payments) {
    if(this.transaction) {
      this.transaction.setPayments(payments);
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
  
  newTransactions: function(till_id, user_id) {
    this.reset();
    this.till_id = till_id;
    this.user_id = user_id;
    this.setTransactions(new Transactions({user_id: user_id, till_id: till_id, tax_rate: 0.07, complete: false, locked: false}));
  },
  
  setTransactions: function(transaction) {
    this.transaction = transaction;
    this.notifyControllers(transaction);
  },
  
  saveTransactions: function() {
    if(this.transaction.finishable() && this.transaction.save()) {
      credit_adjustment = 0;
      till_adjustment = 0;
      
      lines = this.transaction.lines();
      for(line in lines) {
        lines[line].transactions_id = this.transaction.id;
        if(!lines[line].save()) {
          console.error('Line not saved.');
        }
      }
      
      payments = this.transaction.payments();
      for(payment in payments) {
        if(payments[payment].form == 'store_credit') {
          credit_adjustment += payments[payment].amount;
        }
        if(payments[payment].form == 'cash') {
          till_adjustment += payments[payment].amount;
        }
        payments[payment].transactions_id = this.transaction.id;
        if(!payments[payment].save()) {
          console.error('Payment not saved.');
        }
      }
      
      if(credit_adjustment != 0) {
        customer = this.transaction.customer();
        if(customer != undefined) {
          customer.credit = customer.credit - credit_adjustment;
          if(!customer.save()) {
            console.error('Customer not saved.');
          }
        }
      }
      
      if(this.transaction.total() > 0) {
        till_adjustment = till_adjustment + this.transaction.amountDue();
      }
      if(till_adjustment != 0) {
        entry = new Entry({
          till_id: this.till_id,
          user_id: this.user_id,
          title: 'Transactions: ' + this.transaction.id,
          amount: till_adjustment
        });
        if(!entry.save()) {
          console.error('Entry not saved.');
        }
      }
      
      this.notifyObservers('/api/transactions/' + this.transaction.id + '/receipt');
      this.newTransactions(this.till_id, this.user_id);
    }
  }
});