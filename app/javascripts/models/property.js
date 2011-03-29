//= require "item"

var Property = new JS.Class({
  extend: {
    find: function(id) {
      property = undefined;
      $.ajax({
        url: '/api/properties/' + id,
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          property = results.property;
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
      return property;
    }
  },
  
  initialize: function(params) {
    this.id = params.id;
    if(params.item != undefined) {
      if(this.item == undefined) {
        this.item = new Item(params.item);
      }
    } else {
      this.item = undefined;
    }
    this.key = params.key;
    this.value = params.value;
  },
  
  save: function() {
    
  },
  
  valid: function() {
    return true;
  }
});