//= require "person"

var Email = new JS.Class({
  extend: {
    find: function(id) {
      email = undefined;
      $.ajax({
        url: '/api/emails/' + id,
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          email = results.email;
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
      return email;
    }
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.person_id = params.person_id;
    this.address = params.address;
  },

  save: function() {
    
  },
  
  valid: function() {
    if(this.address == '' || this.address == undefined || this.address == null) {
      return false;
    }
    return true;
  }
});