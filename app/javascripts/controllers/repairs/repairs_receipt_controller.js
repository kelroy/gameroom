//= require "../view_controller"

var RepairsReceiptController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    
    $('ul#receipt_nav a.close', this.view).bind('click', {instance: this}, this.doClose);
    $('ul#receipt_nav a.print', this.view).bind('click', {instance: this}, this.doPrint);
  },
  
  update: function(url) {
    $('object#receipt_window', this.view).attr('data', url);
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