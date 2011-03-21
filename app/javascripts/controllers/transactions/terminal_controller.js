//= require "till_controller"
//= require "transaction_controller"

var TerminalController = new JS.Class({
  
  initialize: function() {
    this.transaction_controller = new TransactionController('div#transaction');
    this.receipt_controller = new ReceiptController('div#receipt');
    this.till_controller = new TillController('div#till');
    
    this.till_controller.addObserver(this.updateTill, this);
    this.transaction_controller.addObserver(this.presentReceipt, this);
    
    this.reset();
  },
  
  reset: function() {
    this.transaction_controller.view.hide();
    this.receipt_controller.view.hide();
    this.till_controller.view.show();
  },
  
  presentReceipt: function(url) {
    this.receipt_controller.update(url);
    this.receipt_controller.view.show();
  },
  
  updateTill: function(till) {
    this.transaction_controller.newTransaction(till);
    this.transaction_controller.transaction_nav_controller.update(till);
    this.till_controller.view.hide();
    this.transaction_controller.view.show();
  }
});