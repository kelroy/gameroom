//= require "view_controller"
//= require "../models/transaction"
//= require "../models/payment"

var PaymentScaleController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.transaction = new Transaction();
    $('ul#payment_scale_container a.button').bind('click', {instance: this}, this.onScale);
  },
  
  onScale: function(event) {
    index = parseFloat($('ul#payment_scale_container li a.button').index(this));
    /*ratio = event.data.instance.transaction.ratio();
    total = event.data.instance.transaction.total();
    credit = total * ((10 - index) / 10.0);
    cash = (Math.abs(total) - Math.abs(credit)) * ratio;
    $('input#payment_action_cash_value', this.view).val(Currency.format(Math.abs(cash)));
    $('input#payment_action_credit_value', this.view).val(Currency.format(Math.abs(credit)));
    event.data.instance.notifyObservers();*/
    event.preventDefault();
  },
  
  update: function(transaction) {
    this.transaction = transaction;
  }
  
});