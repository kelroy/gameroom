//= require "till"

var Entry = new JS.Class({
  extend: {
    find: function(id) {
      employee = undefined;
      $.ajax({
        url: '/api/entry/' + id,
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          employee = results.employee;
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
      return employee;
    }
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.till_id = params.till_id;
    this.title = params.title;
    this.description = params.description;
    this.time = params.time;
    this.amount = params.amount;
    this.action = params.action;
  },
  
  valid: function() {
    return true;
  }
});