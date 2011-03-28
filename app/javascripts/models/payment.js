//= require "transaction"

var Payment = new JS.Class({
  
  initialize: function(params) {
    this.id = params.id;
    this.transaction_id = params.transaction_id;
    this.form = params.form;
    this.amount = params.amount;
  },
  
  valid: function() {
    return true;
  }
});