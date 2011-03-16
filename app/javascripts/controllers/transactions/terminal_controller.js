//= require "till_controller"
//= require "transaction_controller"
//= require "terminal_user_controller"

var TerminalController = new JS.Class({
  
  initialize: function() {
    this.terminal_user_controller = new TerminalUserController('ul#user_nav');
    this.transaction_controller = new TransactionController('div#transaction');
    this.till_controller = new TillController('div#till');
    this.till_controller.addObserver(this.updateTill, this);
    
    this.reset();
  },
  
  reset: function() {
    this.transaction_controller.view.hide();
    this.till_controller.view.show();
  },
  
  updateTill: function(till) {
    this.transaction_controller.newTransaction(till);
    this.terminal_user_controller.update(till);
    this.till_controller.view.hide();
    this.transaction_controller.view.show();
  }
});