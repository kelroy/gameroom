//= require "till"
//= require "customer"
//= require "receipt"
//= require "item"
//= require "payment"

var Transaction = new JS.Class({
  
  initialize: function() {
    this.id = null;
    this.till = new Till();
    this.customer = new Customer();
    this.receipt = new Receipt();
    this.lines = [];
    this.payments = [
      new Payment('store_credit', 0),
      new Payment('gift_card', 0),
      new Payment('credit_card', 0),
      new Payment('check', 0),
      new Payment('cash', 0)
    ];
    this.tax_rate = 0.07;
    this.complete = false;
    this.locked = false;
  },
  
  subtotal: function() {
    subtotal = 0;
    for(line in this.lines) {
      subtotal += this.lines[line].calculateSubtotal();
    }
    return subtotal;
  },
  
  total: function() {
    return this.subtotal() + this.tax();
  },
  
  tax: function() {
    subtotal = this.subtotal();
    if(subtotal > 0) {
      return subtotal * this.tax_rate;
    } else {
      return 0;
    }
  },
  
  change: function() {
    payment_total = 0;
    for(payment in this.payments) {
      payment_total += this.payments[payment].amount;
    }
    return this.total() - payment_total;
  },
  
  ratio: function() {
    return 1.0 / Math.abs(this.subtotal() / this.cashSubtotal());
  },
  
  countItems: function() {
    count = 0;
    for(line in this.lines) {
      count += this.lines[line].quantity;
    }
    return count;
  },
  
  setLines: function(lines) {
    this.lines = lines;
  },
  
  updatePayment: function(updated_payment) {
    for(payment in this.payments) {
      if(this.payments[payment].form == updated_payment.form) {
        this.payments[payment] = updated_payment;
      }
    }
  },
  
  save: function() {
    this.id = 1;
    return true;
  },
  
  valid: function() {
    if(this.change() == 0 && this.customer.valid()) {
      return true;
    } else {
      return false;
    }
  }
  
  /*onCreditChange: function(event) {
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
  },*/
});