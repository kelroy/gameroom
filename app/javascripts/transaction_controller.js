//= require "customer_controller"
//= require "cart_controller"
//= require "payment_controller"
//= require "review_controller"
//= require "page_controller"
//= require "summary_controller"
//= require "finish_controller"
//= require "till"
//= require "currency"

var TransactionController = new JS.Class({
  
  transactions: [],
  
  initialize: function() {
    
    this.customer_controller = new CustomerController('section#customer');
    this.cart_controller = new CartController('section#cart');
    this.payment_controller = new PaymentController('section#payment');
    this.review_controller = new ReviewController('section#review');
    this.till = new Till();
    
    this.section_controller = new PageController('ul#section_nav', [
      this.customer_controller.view,
      this.cart_controller.view,
      this.payment_controller.view,
      this.review_controller.view
    ]);
    this.summary_controller = new SummaryController('ul#summary');
    this.finish_controller = new FinishController('ul#finish');
    this.transaction_nav = $('ul#transaction_nav').hide();
  },
  
  reset: function() {
    this.customer_controller.reset();
    this.cart_controller.reset();
    this.payment_controller.reset();
    this.review_controller.reset();
    this.section_controller.reset();
    this.summary_controller.reset();
  },
  
  addTransaction: function(till) {
    this.reset();
    transaction = new Transaction();
    transaction.addObserver(this.payment_controller.update, this.payment_controller);
    transaction.addObserver(this.review_controller.update, this.review_controller);
    transaction.addObserver(this.summary_controller.update, this.summary_controller);
    transaction.addObserver(this.finish_controller.update, this.finish_controller);
    transaction.updated();
    this.customer_controller.addObserver(transaction.updateCustomer, transaction);
    this.cart_controller.addObserver(transaction.updateCart, transaction);
    this.payment_controller.addObserver(transaction.updatePayment, transaction);
    this.review_controller.addObserver(transaction.updateReceipt, transaction);
    this.finish_controller.addObserver(transaction.save, transaction);
    this.transactions.push(transaction);
  }
});