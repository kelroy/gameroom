//= require "../view_controller"
//= require "../../models/transaction"
//= require "../../models/payment"

var PaymentScaleController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.transaction = null;
    $('ul#payment_scale_container a.button').bind('click', {instance: this}, this.onScale);
  },
  
  onScale: function(event) {
    index = parseFloat($(this).attr('data-index'));
    amount = Math.abs(event.data.instance.transaction.payoutCreditSubtotal()) * (index / 10.0);
    event.data.instance.notifyObservers(amount);
    event.preventDefault();
  },
  
  update: function(transaction) {
    this.transaction = transaction;
  }
  
});