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
      subtotal += this.lines[line].subtotal();
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
    if(this.subtotal() >= 0) {
      payment_total = 0;
      for(payment in this.payments) {
        payment_total += this.payments[payment].amount;
      }
      return this.total() - payment_total;
    } else {
      cash_payment = new Payment('cash', 0);
      for(payment in this.payments) {
        if(this.payments[payment].form == 'cash') {
          cash_payment = this.payments[payment];
        }
      }
      if(cash_payment.amount != 0) {
        return cash_payment.amount;
      } else {
        return 0;
      }
    }
  },
  
  ratio: function() {
    return 1.0 / Math.abs(this.creditSubtotal() / this.cashSubtotal());
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
    subtotal = this.subtotal();
    for(payment in this.payments) {
      if(subtotal < 0 && this.payments[payment].amount > 0) {
        this.payments[payment].amount = 0;
      }
      if(subtotal >= 0 && this.payments[payment].amount < 0) {
        this.payments[payment].amount = 0;
      }
      if(subtotal >= 0 && this.payments[payment].form == 'store_credit' && this.payments[payment].amount > this.total()) {
        this.payments[payment].amount = 0;
      }
    }
  },
  
  purchaseCreditSubtotal: function() {
    var subtotal = 0;
    for(line in this.lines) {
      subtotal += this.lines[line].purchaseCreditSubtotal();
    }
    return subtotal;
  },
  
  purchaseCashSubtotal: function() {
    var subtotal = 0;
    for(line in this.lines) {
      subtotal += this.lines[line].purchaseCashSubtotal();
    }
    return subtotal;
  },
  
  creditSubtotal: function() {
    var subtotal = 0;
    for(line in this.lines) {
      subtotal += this.lines[line].creditSubtotal();
    }
    return Math.abs(this.purchaseCreditSubtotal() - Math.abs(subtotal));
  },
  
  cashSubtotal: function() {
    var subtotal = 0;
    for(line in this.lines) {
      subtotal += this.lines[line].cashSubtotal();
    }
    console.log(subtotal);
    return Math.abs(this.purchaseCashSubtotal() - Math.abs(subtotal));
  },
  
  updatePayment: function(updated_payment) {
    if(this.subtotal() < 0) {
      switch(updated_payment.form) {
        case 'store_credit':
          store_credit_subtotal = this.creditSubtotal();
          if(Math.abs(updated_payment.amount) > store_credit_subtotal) {
            updated_payment.amount = store_credit_subtotal * -1;
          }
          this._updatePayment('cash', new Payment('cash', this._calculateCashPayout(Math.abs(updated_payment.amount)) * -1));
          break;
        case 'cash':
          cash_subtotal = this.cashSubtotal();
          if(Math.abs(updated_payment.amount) > cash_subtotal) {
            updated_payment.amount = cash_subtotal * -1;
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
    console.log('Ratio: ' + this.ratio());
    console.log('Cash Amount: ' + cash_amount);
    console.log('Cash Subtotal: ' + this.cashSubtotal());
    console.log('Store Credit Payout: ' + ((1.0 / this.ratio()) * (this.cashSubtotal() - cash_amount)));
    return (1.0 / this.ratio()) * (this.cashSubtotal() - cash_amount);
  },
  
  _calculateCashPayout: function(store_credit_amount) {
    console.log('Ratio: ' + this.ratio());
    console.log('Store Credit Amount: ' + store_credit_amount);
    console.log('Store Credit Subtotal: ' + this.creditSubtotal());
    console.log('Cash Payout: ' + ((this.creditSubtotal() - store_credit_amount) * this.ratio()));
    return (this.creditSubtotal() - store_credit_amount) * this.ratio();
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