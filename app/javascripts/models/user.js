//= require "../model"

var User = new JS.Class(Model, {
  extend: {
    resource: 'user'
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.login = params.login;
    this.pin = params.pin;
    this.email = params.email;
    this.administrator = params.administrator;
    this.login_count = params.login_count;
    this.failed_login_count = params.failed_login_count;
    this.last_login_at = params.last_login_at;
    this.last_request_at = params.last_request_at;
    this.last_login_ip = params.last_login_ip;
    this.current_login_ip = params.current_login_ip;
    this.active = params.active;
  },
  
  person: function() {
    return this._find_child('person');
  },
  
  valid: function() {
    return true;
  }
});