//= require "../model"

var Payment = new JS.Class(Model, {
  extend: {
    resource: 'payment'
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.transaction_id = params.transaction_id;
    this.form = params.form;
    this.amount = params.amount;
  },
  
  transaction: function() {
    return this._find_parent('transaction');
  },
  
  valid: function() {
    return true;
  }
});