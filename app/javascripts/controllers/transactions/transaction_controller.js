//= require "../view_controller"
//= require "customer_controller"
//= require "cart_controller"
//= require "payment_controller"
//= require "review_controller"
//= require "transaction_summary_controller"
//= require "transaction_finish_controller"
//= require "../page_controller"
//= require "../../models/till"
//= require "../../models/transaction"
//= require "../../currency"

var TransactionController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function() {
    this.callSuper();
    this.till = null;
    this.transaction = null;
    
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
    this.summary_controller = new TransactionSummaryController('ul#summary');
    this.finish_controller = new TransactionFinishController('ul#finish');
    
    this.customer_controller.addObserver(this.updateCustomer, this);
    this.cart_controller.addObserver(this.updateCart, this);
    this.payment_controller.addObserver(this.updatePayment, this);
    this.payment_controller.scale_controller.addObserver(this.updatePayoutRatio, this);
    this.review_controller.addObserver(this.updateReceipt, this);
    this.finish_controller.addObserver(this.saveTransaction, this);
    
    this.addObserver(this.cart_controller.update, this.cart_controller);
    this.addObserver(this.payment_controller.update, this.payment_controller);
    this.addObserver(this.review_controller.update, this.review_controller);
    this.addObserver(this.summary_controller.update, this.summary_controller);
    this.addObserver(this.finish_controller.update, this.finish_controller);
    
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
    event.data.instance.newTransaction(event.data.instance.till);
    event.preventDefault();
  },

  updateCustomer: function(customer) {
    if(this.transaction) {
      this.transaction.customer = customer;
      this.notifyObservers(this.transaction);
    }
  },
  
  updateCart: function(lines) {
    if(this.transaction) {
      this.transaction.setLines(lines);
      this.notifyObservers(this.transaction);
    }
  },
  
  updatePayment: function(payment) {
    if(this.transaction) {
      this.transaction.updatePayment(payment);
      this.notifyObservers(this.transaction);
    }
  },
  
  updatePayoutRatio: function(ratio) {
    if(this.transaction) {
      this.transaction.updatePayoutRatio(ratio);
      this.notifyObservers(this.transaction);
    }
  },
  
  updateReceipt: function(quantity) {
    if(this.transaction) {
      this.transaction.receipt.quantity = quantity;
    }
  },
  
  newTransaction: function(till) {
    this.reset();
    this.till = till;
    this.setTransaction(new Transaction({till: till, tax_rate: 0.07, complete: false, locked: false}));
  },
  
  setTransaction: function(transaction) {
    this.transaction = transaction;
    this.notifyObservers(transaction);
  },
  
  saveTransaction: function() {
    controller = this;
    this.transaction.save(function(transaction) {
      controller.newTransaction(controller.till);
      url = '/api/transactions/' + transaction.id + '/receipt';
      window.open(url, "transaction_receipt", "toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=260");
    });
  }
});