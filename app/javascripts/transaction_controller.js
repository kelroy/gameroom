var TransactionController = new JS.Class({
  
  initialize: function() {
    
    this.customer_controller = new CustomerController('section#customer');
    this.cart_controller = new CartController('section#cart');
    this.payment_controller = new PaymentController('section#payment');
    this.review_controller = new ReviewController('section#review');
    this.till = new Till();
    
    this.section_nav = new TabController('ul#section_nav');
    this.summary_nav = $('ul#summary_nav').hide();
    this.transaction_nav = $('ul#transaction_nav').hide();
  },
  
  newTransaction: function() {
    //this.customer_controller.view.show();
  }
});