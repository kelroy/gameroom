//= require "till"

var Entry = new JS.Class({
  extend: {
    find: function(id) {
      entry = undefined;
      $.ajax({
        url: '/api/entries/' + id,
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          entry = results.entry;
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
      return entry;
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