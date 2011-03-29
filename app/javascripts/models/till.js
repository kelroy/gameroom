//= require "entry"

var Till = new JS.Class({
  extend: {
    find: function(id) {
      till = undefined;
      $.ajax({
        url: '/api/tills/' + id,
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          till = results.till;
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
      return till;
    }
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.title = params.title;
    this.entries = [];
    for(entry in params.entries) {
      this.entries.push(new Entry($.extend(params.entries[entry], {till: this})));
    }
  },
  
  save: function() {
    
  },
  
  valid: function() {
    return true;
  }
});