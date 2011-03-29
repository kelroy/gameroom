//= require "transaction"

var Payment = new JS.Class({
  extend: {
    find: function(id) {
      payment = undefined;
      $.ajax({
        url: '/api/payments/' + id,
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          payment = results.payment;
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
      return payment;
    }
  },
  
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