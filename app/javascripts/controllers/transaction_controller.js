//= require "customer_controller"
//= require "cart_controller"
//= require "payment_controller"
//= require "review_controller"
//= require "page_controller"
//= require "summary_controller"
//= require "finish_controller"
//= require "../models/till"
//= require "../models/transaction"
//= require "../currency"

var TransactionController = new JS.Class({
  include: JS.Observable,
  
  transactions: [],
  
  initialize: function() {
    this.till = new Till();
    this.current_transaction = null;
    
    this.transaction_nav = $('ul#transaction_nav');
    this.customer_controller = new CustomerController('section#customer');
    this.cart_controller = new CartController('section#cart');
    this.payment_controller = new PaymentController('section#payment');
    this.review_controller = new ReviewController('section#review');
    this.section_controller = new PageController('ul#section_nav', [
      this.customer_controller.view,
      this.cart_controller.view,
      this.payment_controller.view,
      this.review_controller.view
    ]);
    this.summary_controller = new SummaryController('ul#summary');
    this.finish_controller = new FinishController('ul#finish');
    
    this.customer_controller.addObserver(this.updateCustomer, this);
    this.cart_controller.addObserver(this.updateCart, this);
    this.payment_controller.addObserver(this.updatePayment, this);
    this.review_controller.addObserver(this.updateReceipt, this);
    this.finish_controller.addObserver(this.saveTransaction, this);
    
    this.addObserver(this.cart_controller.update, this.cart_controller);
    this.addObserver(this.payment_controller.update, this.payment_controller);
    this.addObserver(this.review_controller.update, this.review_controller);
    this.addObserver(this.summary_controller.update, this.summary_controller);
    this.addObserver(this.finish_controller.update, this.finish_controller);
    
    this.reset();
    this.customer_controller.view.hide();
    this.section_controller.view.hide();
    this.summary_controller.view.hide();
    this.finish_controller.view.hide();
    this.transaction_nav.hide();
  },
  
  reset: function() {
    this.customer_controller.reset();
    this.cart_controller.reset();
    this.payment_controller.reset();
    this.review_controller.reset();
    this.section_controller.reset();
    this.summary_controller.reset();
    this.finish_controller.view.show();
    this.section_controller.view.show();
  },

  updateCustomer: function(customer) {
    if(this.current_transaction) {
      this.current_transaction.customer = customer;
      this.notifyObservers(this.current_transaction);
    }
  },
  
  updateCart: function(lines) {
    if(this.current_transaction) {
      this.current_transaction.setLines(lines);
      this.notifyObservers(this.current_transaction);
    }
  },
  
  updatePayment: function(payment) {
    if(this.current_transaction) {
      this.current_transaction.updatePayment(payment);
      this.notifyObservers(this.current_transaction);
    }
  },
  
  updateReceipt: function(quantity) {
    if(this.current_transaction) {
      this.current_transaction.receipt.quantity = quantity;
    }
  },
  
  newTransaction: function(till) {
    this.reset();
    this.till = till;
    this.addTransaction(new Transaction());
    this.setCurrentTransaction(this.transactions.length - 1);
  },
  
  addTransaction: function(transaction) {
    this.transactions.push(transaction);
  },
  
  removeTransaction: function(index) {
    this.transactions.splice(index, 1);
  },
  
  setCurrentTransaction: function(index) {
    this.current_transaction = this.transactions[index];
  },
  
  saveTransaction: function() {
    if(this.current_transaction.save()) {
      id = this.current_transaction.id;
      url = '/transactions/' + id + '/receipt';
      window.open(url, "transaction_receipt", "toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=260");
    }
  }
});