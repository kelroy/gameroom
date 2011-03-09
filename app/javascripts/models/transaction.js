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
  
  amountDue: function() {
    payment_total = 0;
    for(payment in this.payments) {
      payment_total += this.payments[payment].amount;
    }
    return this.total() - payment_total;
  },
  
  ratio: function() {
    return 1.0 / Math.abs(this.storeCreditTotal() / this.cashTotal());
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
  
  storeCreditTotal: function() {
    total = 0;
    for(line in this.lines) {
      total += this.lines[line].calculateStoreCreditSubtotal();
    }
    return total;
  },
  
  cashTotal: function() {
    total = 0;
    for(line in this.lines) {
      total += this.lines[line].calculateCashSubtotal();
    }
    return total;
  },
  
  updatePayment: function(updated_payment) {
    if(updated_payment.amount < 0) {
      switch(updated_payment.form) {
        case 'store_credit':
          store_credit_total = this.storeCreditTotal();
          if(updated_payment.amount < store_credit_total) {
            updated_payment.amount == store_credit_total;
          }
          this._updatePayment('cash', new Payment('cash', this._calculateCashPayout(Math.abs(updated_payment.amount)) * -1));
          break;
        case 'cash':
          cash_total = this.cashTotal();
          if(updated_payment.amount < cash_total) {
            updated_payment.amount == cash_total;
          }
          this._updatePayment('store_credit', new Payment('store_credit', this._calculateStoreCreditPayout(Math.abs(updated_payment.amount)) * -1));
          break;
        default:
          break;
      }
    }
    this._updatePayment(updated_payment.form, updated_payment);
  },
  
  _updatePayment: function(form, updated_payment) {
    for(payment in this.payments) {
      if(this.payments[payment].form == form) {
        this.payments[payment] = updated_payment;
      }
    }
  },
  
  _calculateStoreCreditPayout: function(cash_amount) {
    return (1.0 / this.ratio()) * (this.cashTotal() - cash_amount);
  },
  
  _calculateCashPayout: function(store_credit_amount) {
    return (this.storeCreditTotal() - store_credit_amount) * this.ratio();
  },
  
  save: function() {
    this.id = 1;
    return true;
  },
  
  valid: function() {
    if(this.total() > 0 && this.amountDue() == 0) {
      return true;
    } else if(this.total() < 0) {
      if(this.customer.valid()) {
        return true;
      }
    }
    return false;
  }
});