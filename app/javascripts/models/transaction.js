//= require "../model"
//= require "till"
//= require "customer"
//= require "item"
//= require "line"
//= require "payment"

var Transaction = new JS.Class(Model, {
  extend: {
    resource: 'transaction',
    columns: ['id', 'till_id', 'customer_id', 'user_id', 'tax_rate', 'complete', 'locked'],
    belongs_to: ['customer', 'till', 'user'],
    has_many: ['lines', 'payments']
  },
  
  subtotal: function() {
    lines = this.lines();
    subtotal = 0;
    for(line in lines) {
      subtotal += lines[line].subtotal();
    }
    return parseInt(subtotal);
  },
  
  total: function() {
    return parseInt(this.purchaseSubtotal() + this.tax());
  },
  
  tax: function() {
    lines = this.lines();
    if(this.subtotal() > 0) {
      purchase_subtotal = this.purchaseSubtotal();
      taxable_subtotal = 0;
      for(line in lines) {
        if(lines[line].taxable && lines[line].subtotal() > 0) {
          taxable_subtotal += lines[line].subtotal();
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
    ratio = 1.0 / Math.abs(this.creditSubtotal() / this.cashSubtotal());
    if(isNaN(ratio)) {
      return 0;
    } else {
      return ratio;
    }
  },
  
  purchaseSubtotal: function() {
    payments = this.payments();
    subtotal = this.subtotal();
    if(subtotal >= 0) {
      store_credit_payment = 0;
      for(payment in payments) {
        if(payments[payment].form == 'store_credit') {
          store_credit_payment += parseInt(payments[payment].amount);
        }
      }
      return subtotal - store_credit_payment;
    } else {
      return subtotal;
    }
  },
  
  amountDue: function() {
    payments = this.payments();
    
    if(this.subtotal() >= 0) {
      payment_total = 0;
      for(payment in payments) {
        if(payments[payment].form != 'store_credit') {
          payment_total += parseInt(payments[payment].amount);
        }
      }
      return this.total() - payment_total;
    } else {
      cash_payment = 0;
      for(payment in payments) {
        if(payments[payment].form == 'cash') {
          cash_payment += payments[payment].amount;
        }
      }
      return cash_payment;
    }
  },
  
  countItems: function() {
    lines = this.lines();
    count = 0;
    for(line in lines) {
      count += lines[line].quantity;
    }
    return count;
  },
  
  creditSubtotal: function() {
    lines = this.lines();
    subtotal = 0;
    for(line in lines) {
      subtotal += lines[line].creditSubtotal();
    }
    return Math.abs(subtotal);
  },
  
  cashSubtotal: function() {
    lines = this.lines();
    subtotal = 0;
    for(line in lines) {
      subtotal += lines[line].cashSubtotal();
    }
    return Math.abs(subtotal);
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
    subtotal = this.subtotal();
    credit_payout = parseInt(subtotal * ratio);
    cash_payout = parseInt((credit_cash_ratio - (credit_cash_ratio * ratio)) * subtotal);
    this.updatePayment(new Payment({form: 'store_credit', amount: credit_payout}));
    this.updatePayment(new Payment({form: 'cash', amount: cash_payout}));
  },
  
  updatePayment: function(updated_payment) {
    payments = this.payments();
    found = false;
    for(payment in payments) {
      if(payments[payment].form == updated_payment.form) {
        payments[payment] = updated_payment;
        found = true;
      }
    }
    if(!found) {
      this.addPayment(updated_payment);
    }
  },
  
  save: function(callback) {
    if(this.valid()) {
      transaction = {
        till_id: this.till.id,
        user_id: this.user_id,
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
  }
});