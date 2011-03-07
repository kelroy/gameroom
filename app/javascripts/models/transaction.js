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
    this.payments = [];
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
    return payment_total - this.total();
  },
  
  save: function() {
    this.id = 1;
    return true;
  },
  
  itemCount: function() {
    count = 0;
    for(line in this.lines) {
      count += this.lines[line].quantity;
    }
    return count;
  },
  
  valid: function() {
    return true;
  }
});