//= require "../view_controller"

var TransactionsPaymentScaleController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    $('ul#payment_scale_container a.button').bind('click', {instance: this}, this.onScale);
  },
  
  onScale: function(event) {
    index = parseFloat($(this).attr('data-index'));
    event.data.instance.notifyObservers(index / 10.0);
    event.preventDefault();
  }
});