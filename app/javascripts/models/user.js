//= require "person"

var User = new JS.Class({
  
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