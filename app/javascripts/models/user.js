//= require "person"

var User = new JS.Class({
  extend: {
    find: function(id) {
      user = undefined;
      $.ajax({
        url: '/api/users/' + id,
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          user = results.user;
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
      return user;
    }
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.login = params.login;
    this.pin = params.pin;
    this.email = params.email;
    this.active = params.active;
  },
  
  valid: function() {
    return true;
  }
});