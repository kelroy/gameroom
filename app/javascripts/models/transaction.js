//= require "till"
//= require "customer"
//= require "receipt"
//= require "item"
//= require "payment"

var Transaction = new JS.Class({
  
  initialize: function(params) {
    this.id = params.id;
    if(params.till != undefined) {
      this.till = new Till(params.till);
    } else {
      this.till = undefined;
    }
    if(params.customer != undefined) {
      this.customer = new Customer(params.customer);
    } else {
      this.customer = undefined;
    }
    if(params.receipt != undefined) {
      this.receipt = new Receipt(params.receipt);
    } else {
      this.receipt = undefined;
    }
    this.lines = [];
    for(line in params.lines) {
      this.lines.push(new Line(params.lines[line].line));
    }
    this.payments = [
      new Payment({form: 'store_credit', amount: 0}),
      new Payment({form: 'gift_card', amount: 0}),
      new Payment({form: 'credit_card', amount: 0}),
      new Payment({form: 'check', amount: 0}),
      new Payment({form: 'cash', amount: 0})
    ];
    this.tax_rate = params.tax_rate;
    this.complete = params.complete;
    this.locked = params.locked;
  },
  
  subtotal: function() {
    subtotal = 0;
    for(line in this.lines) {
      subtotal += this.lines[line].subtotal();
    }
    return parseInt(subtotal);
  },
  
  total: function() {
    return parseInt(this.purchaseSubtotal() + this.tax());
  },
  
  tax: function() {
    if(this.subtotal() > 0) {
      purchase_subtotal = this.purchaseSubtotal();
      taxable_subtotal = 0;
      for(line in this.lines) {
        if(this.lines[line].taxable) {
          taxable_subtotal += this.lines[line].subtotal();
        }
      }
      if(taxable_subtotal < purchase_subtotal) {
        return parseInt(Math.round(taxable_subtotal * this.tax_rate));
      } else {
        return parseInt(Math.round(purchase_subtotal * this.tax_rate));
      }
    } else {
      return 0;
    }
  },
  
  ratio: function() {
    return 1.0 / Math.abs(this.creditSubtotal() / this.cashSubtotal());
  },
  
  purchaseSubtotal: function() {
    subtotal = this.subtotal();
    if(subtotal >= 0) {
      store_credit_payment = 0;
      for(payment in this.payments) {
        if(this.payments[payment].form == 'store_credit') {
          store_credit_payment += parseInt(this.payments[payment].amount);
        }
      }
      return subtotal - store_credit_payment;
    } else {
      return subtotal;
    }
  },
  
  amountDue: function() {
    if(this.subtotal() >= 0) {
      payment_total = 0;
      for(payment in this.payments) {
        if(this.payments[payment].form != 'store_credit') {
          payment_total += parseInt(this.payments[payment].amount);
        }
      }
      return this.total() - payment_total;
    } else {
      cash_payment = 0;
      for(payment in this.payments) {
        if(this.payments[payment].form == 'cash') {
          cash_payment += this.payments[payment].amount;
        }
      }
      return cash_payment;
    }
  },
  
  countItems: function() {
    count = 0;
    for(line in this.lines) {
      count += this.lines[line].quantity;
    }
    return count;
  },
  
  creditSubtotal: function() {
    var subtotal = 0;
    for(line in this.lines) {
      subtotal += this.lines[line].creditSubtotal();
    }
    return Math.abs(subtotal);
  },
  
  cashSubtotal: function() {
    var subtotal = 0;
    for(line in this.lines) {
      subtotal += this.lines[line].cashSubtotal();
    }
    return Math.abs(subtotal);
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
    }
    if(subtotal < 0) {
      this.updatePayment(new Payment({form: 'store_credit', amount: subtotal}));
      this.updatePayment(new Payment({form: 'cash', amount: 0}));
    }
  },
  
  updateCreditPayout: function(payment) {
    subtotal = this.subtotal();
    if(subtotal < 0) {
      this.updatePayoutRatio(payment.amount / subtotal);
    }
  },
  
  updateCashPayout: function(payment) {
    subtotal = this.subtotal();
    if(subtotal < 0) {
      credit_cash_ratio = this.ratio();
      cash_payout = parseInt(Math.round((credit_cash_ratio - (credit_cash_ratio * 0)) * subtotal));
      this.updatePayoutRatio(1 - (payment.amount / cash_payout));
    }
  },
  
  updatePayoutRatio: function(ratio) {
    if(ratio < 0 || ratio > 1) {
      ratio = 1;
    }
    credit_cash_ratio = this.ratio();
    console.log(credit_cash_ratio);
    subtotal = this.subtotal();
    credit_payout = parseInt(subtotal * ratio);
    cash_payout = parseInt((credit_cash_ratio - (credit_cash_ratio * ratio)) * subtotal);
    this.updatePayment(new Payment({form: 'store_credit', amount: credit_payout}));
    this.updatePayment(new Payment({form: 'cash', amount: cash_payout}));
  },
  
  updatePayment: function(updated_payment) {
    for(payment in this.payments) {
      if(this.payments[payment].form == updated_payment.form) {
        this.payments[payment] = updated_payment;
      }
    }
  },
  
  save: function(callback) {
    if(this.valid()) {
      transaction = {
        till_id: this.till.id,
        tax_rate: this.tax_rate,
        complete: this.complete,
        locked: this.locked,
        payments_attributes: [],
        lines_attributes: []
      };
      for(payment in this.payments) {
        transaction.payments_attributes.push({
          form: this.payments[payment].form,
          amount: this.payments[payment].amount
        });
      }
      for(line in this.lines) {
        if(this.lines[line].item.id != undefined) {
          transaction.lines_attributes.push({
            item_id: this.lines[line].item.id,
            quantity: this.lines[line].quantity,
            price: this.lines[line].price,
            taxable: this.lines[line].taxable
          });
        } else {
          transaction.lines_attributes.push({
            quantity: this.lines[line].quantity,
            price: this.lines[line].price,
            taxable: this.lines[line].taxable,
            item_attributes: {
              title: this.lines[line].item.title,
              description: this.lines[line].item.description,
              price: this.lines[line].item.price,
              taxable: this.lines[line].item.taxable,
              discountable: this.lines[line].item.discountable,
              locked: this.lines[line].item.locked,
              active: this.lines[line].item.active,
            }
          });
        }
      }
      if(this.customer != undefined) {
        transaction.customer_id = this.customer.id;
      }
      
      $.ajax({
        url: '/api/transactions',
        accept: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify({transaction: transaction}),
        dataType: 'json',
        processData: false,
        type: 'POST',
        success: function(result) {
          callback(result.transaction);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error Status: ' + XMLHttpRequest.status);
          console.error('Error Text: ' + textStatus);
          console.error('Error Thrown: ' + errorThrown);
          console.log(XMLHttpRequest);
        },
        username: 'x',
        password: 'x'
        
      });
      
      return true;
    } else {
      return false;
    }
  },
  
  valid: function() {
    if(this.subtotal() > 0 && this.amountDue() <= 0) {
      return true;
    } else if(this.subtotal() < 0) {
      if(this.customer != undefined) {
        if(this.customer.valid()) {
          return true;
        }
      }
    }
    return false;
  }
});