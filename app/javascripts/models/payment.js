//= require "../model"

var Payment = new JS.Class(Model, {
  extend: {
    resource: 'payment',
    columns: ['id', 'transaction_id', 'form', 'amount'],
    belongs_to: ['transaction']
  },
  
  valid: function() {
    return true;
  }
});