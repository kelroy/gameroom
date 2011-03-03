//= require "till"
//= require "customer"
//= require "receipt"
//= require "item"
//= require "payment"

var Transaction = new JS.Class({
  include: JS.Observable,
  
  initialize: function() {
    this.till = new Till();
    this.customer = new Customer();
    this.receipt = new Receipt();
    this.items = [];
    this.payments = [];
    this.subtotal = 0;
    this.total = -1000;
    this.tax = 0;
    this.change = 0;
    this.tax_rate = 0.07;
    this.complete = false;
    this.locked = false;
  },
  
  updated: function() {
    this.notifyObservers(this);
  },
  
  updateCustomer: function(customer) {
    this.updated();
  },
  
  updateCart: function(cart) {
    this.updated();
  },
  
  updatePayment: function(payments) {
    this.payments = payments;
    this.updated();
  },
  
  updateReceipt: function(quantity) {
    this.receipt.quantity = quantity;
  },
  
  save: function() {
    
  },
  
  valid: function() {
    return true;
  }
});