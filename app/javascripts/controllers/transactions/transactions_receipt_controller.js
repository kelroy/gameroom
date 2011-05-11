//= require "../view_controller"

var TransactionsReceiptController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    $('ul#transactions_receipt_nav a.close', view).bind('click', {instance: this}, this.doClose);
    $('ul#transactions_receipt_nav a.print', view).bind('click', {instance: this}, this.doPrint);
  },
  
  update: function(url) {
    $('object#transactions_receipt_window', this.view).attr('data', url);
  },
  
  doClose: function(event) {
    event.data.instance.view.hide();
    event.preventDefault();
  },
  
  doPrint: function(event) {
    window.frames['receipt_window'].print();
    event.preventDefault();
  }
});