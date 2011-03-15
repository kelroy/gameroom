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
    return parseInt(this.subtotal() + this.tax());
  },
  
  tax: function() {
    subtotal = this.subtotal();
    if(subtotal > 0) {
      return parseInt(Math.floor(subtotal * this.tax_rate));
    } else {
      return 0;
    }
  },
  
  amountDue: function() {
    if(this.subtotal() >= 0) {
      payment_total = 0;
      for(payment in this.payments) {
        payment_total += parseInt(this.payments[payment].amount);
      }
      return this.total() - payment_total;
    } else {
      cash_payment = new Payment({form: 'cash', amount: 0});
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
      if(subtotal < 0 && this.payments[payment].form == 'store_credit') {
        this.payments[payment].amount = this._calculateStoreCreditPayout(0) * -1;
        this._updatePayment('cash', new Payment({form: 'cash', amount: 0}));
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
  
  payoutCreditSubtotal: function() {
    return this.creditSubtotal() - this.purchaseCreditSubtotal();
  },
  
  payoutCashSubtotal: function() {
    return this.payoutCreditSubtotal() * this.ratio();
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
  
  updatePayment: function(updated_payment) {
    if(this.subtotal() < 0) {
      switch(updated_payment.form) {
        case 'store_credit':
          store_credit_subtotal = this.payoutCreditSubtotal();
          if(Math.abs(updated_payment.amount) > store_credit_subtotal) {
            updated_payment.amount = store_credit_subtotal * -1;
          }
          this._updatePayment('cash', new Payment({form: 'cash', amount: this._calculateCashPayout(Math.abs(updated_payment.amount)) * -1}));
          break;
        case 'cash':
          cash_subtotal = this.payoutCashSubtotal();
          if(Math.abs(updated_payment.amount) > cash_subtotal) {
            updated_payment.amount = cash_subtotal * -1;
          }
          this._updatePayment('store_credit', new Payment({form: 'store_credit', amount: this._calculateStoreCreditPayout(Math.abs(updated_payment.amount)) * -1}));
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
    return (1.0 / this.ratio()) * (this.payoutCashSubtotal() - cash_amount);
  },
  
  _calculateCashPayout: function(store_credit_amount) {
    return (this.payoutCreditSubtotal() - store_credit_amount) * this.ratio();
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
            price: this.lines[line].price
          });
        } else {
          transaction.lines_attributes.push({
            quantity: this.lines[line].quantity,
            price: this.lines[line].price,
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
    if(this.total() > 0 && this.amountDue() <= 0) {
      return true;
    } else if(this.total() < 0) {
      if(this.customer != undefined) {
        if(this.customer.valid()) {
          return true;
        }
      }
    }
    return false;
  }
});