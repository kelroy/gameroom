//= require "transactions_till_controller"
//= require "transactions_receipt_controller"
//= require "transactions_session_nav_controller"
//= require "transactions_controller"

var TransactionsSessionController = new JS.Class({
  
  initialize: function() {
    this.user = null;
    this.till = null;
    
    this.transactions_controller = new TransactionsController('div#transactions');
    this.transactions_session_nav_controller = new TransactionsSessionNavController('ul#transactions_session_nav');
    this.receipt_controller = new TransactionsReceiptController('div#transactions_receipt');
    this.till_controller = new TransactionsTillController('div#transactions_till');
    
    this.till_controller.addObserver(this.updateTill, this);
    this.transactions_controller.addObserver(this.presentReceipt, this);
    this.transactions_session_nav_controller.addObserver(this.onSessionNav, this);
    
    this.reset();
  },
  
  reset: function() {
    this.transactions_controller.view.hide();
    this.receipt_controller.view.hide();
    this.till_controller.view.hide();
  },
  
  activate: function(user) {
    this.updateUser(user);
    this.till_controller.present(Till.all());
  },
  
  deactivate: function() {
    this.reset();
    this.transactions_controller.deactivate();
  },
  
  presentReceipt: function(url) {
    this.receipt_controller.update(url);
    this.receipt_controller.view.show();
  },
  
  updateUser: function(user) {
    this.user = user;
  },
  
  updateTill: function(till) {
    this.till = till;
    this.transactions_session_nav_controller.update(this.till);
    this.transactions_controller.activate(this.user, this.till);
  },
  
  onSessionNav: function(action) {
    this.transactions_controller.newTransaction(this.till, this.user);
  }
});