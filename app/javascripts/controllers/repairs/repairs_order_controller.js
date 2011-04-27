//= require "../view_controller"

var RepairsOrderController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    
    $('ul#order_nav a.close', this.view).bind('click', {instance: this}, this.doClose);
    $('ul#order_nav a.print', this.view).bind('click', {instance: this}, this.doPrint);
  },
  
  update: function(url) {
    $('object#order_window', this.view).attr('data', url);
  },
  
  doClose: function(event) {
    event.data.instance.view.hide();
    event.preventDefault();
  },
  
  doPrint: function(event) {
    window.frames['order_window'].print();
    event.preventDefault();
  }
});