//= require "view_controller"
//= require "../models/transaction"
//= require "../models/payment"

var ScaleController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.total = 0;
    this.transaction = new Transaction();
    $('input#payment_action_credit_value', view).bind('change', {instance: this}, this.onCreditChange);
    $('input#payment_action_cash_value', view).bind('change', {instance: this}, this.onCashChange);
    $('ul#payment_scale_container a.button').bind('click', {instance: this}, this.onScale)
  },
  
  reset: function() {
    $('input#payment_action_credit_value', this.view).val(Currency.format(0));
    $('input#payment_action_cash_value', this.view).val(Currency.format(0));
  },
  
  enable: function() {
    this.view.show();
  },
  
  disable: function() {
    this.view.hide();
  },
  
  onScale: function(event) {
    index = parseFloat($('ul#payment_scale_container li a.button').index(this));
    ratio = event.data.instance.transaction.ratio();
    total = event.data.instance.transaction.total();
    credit = total * ((10 - index) / 10.0);
    cash = (Math.abs(total) - Math.abs(credit)) * ratio;
    $('input#payment_action_cash_value', this.view).val(Currency.format(Math.abs(cash)));
    $('input#payment_action_credit_value', this.view).val(Currency.format(Math.abs(credit)));
    event.data.instance.notifyObservers();
    event.preventDefault();
  },
  
  onCreditChange: function(event) {
    ratio = event.data.instance.transaction.ratio();
    total = event.data.instance.transaction.total();
    credit = Currency.toPennies($(this).val());
    if(credit > Math.abs(total)) {
      credit = Math.abs(total);
    }
    cash = (Math.abs(total) - Math.abs(credit)) * ratio;
    $('input#payment_action_cash_value', this.view).val(Currency.format(cash));
    $(this).val(Currency.format(credit));
    event.data.instance.notifyObservers();
    event.preventDefault();
  },
  
  onCashChange: function(event) {
    ratio = event.data.instance.transaction.ratio();
    total = event.data.instance.transaction.total();
    cash = Currency.toPennies($(this).val());
    cash_subtotal = event.data.instance.transaction.cashSubtotal();
    if(cash > cash_subtotal) {
      cash = cash_subtotal;
    }
    credit = (1.0 / ratio) * (cash_subtotal - cash);
    $('input#payment_action_credit_value', this.view).val(Currency.format(credit));
    $(this).val(Currency.format(cash));
    event.data.instance.notifyObservers();
    event.preventDefault();
  },
  
  setCredit: function(amount) {
    $('input#payment_action_credit_value', this.view).val(Currency.format(Math.abs(amount)));
  },
  
  setTransaction: function(transaction) {
    this.transaction = transaction;
  }
  
});