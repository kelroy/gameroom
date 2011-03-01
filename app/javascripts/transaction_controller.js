//= require "customer_controller"
//= require "cart_controller"
//= require "payment_controller"
//= require "review_controller"
//= require "page_controller"
//= require "summary_controller"
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
    this.transaction_nav = $('ul#transaction_nav').hide();
    $('ul#finish').hide();
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
    transaction.addObserver(this.summary_controller.update, this.summary_controller);
    this.transactions.push(transaction);
  }
});