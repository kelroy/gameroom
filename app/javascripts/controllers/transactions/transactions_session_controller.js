//= require "transactions_till_controller"
//= require "transactions_receipt_controller"
//= require "transactions_controller"

var TransactionsSessionController = new JS.Class({
  
  initialize: function() {
    this.transactions_controller = new TransactionsController('div#transactions');
    this.receipt_controller = new TransactionsReceiptController('div#receipt');
    this.till_controller = new TransactionsTillController('div#till');
    
    this.till_controller.addObserver(this.updateTill, this);
    this.transactions_controller.addObserver(this.presentReceipt, this);
    
    this.reset();
  },
  
  reset: function() {
    this.transactions_controller.view.hide();
    this.receipt_controller.view.hide();
    this.till_controller.view.show();
  },
  
  activate: function(employee) {
    this.updateEmployee(employee);
    this.transactions_controller.view.show();
  },
  
  deactivate: function() {
    this.transactions_controller.view.hide();
  },
  
  presentReceipt: function(url) {
    this.receipt_controller.update(url);
    this.receipt_controller.view.show();
  },
  
  updateEmployee: function(employee) {
    this.employee = employee;
  },
  
  updateTill: function(till) {
    this.transactions_controller.newTransactions(till.id, this.employee.id);
    this.transactions_controller.transactions_nav_controller.update(till);
    this.till_controller.view.hide();
    this.transactions_controller.view.show();
  }
});