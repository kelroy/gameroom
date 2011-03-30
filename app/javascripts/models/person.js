//= require "../model"
//= require "user"
//= require "customer"
//= require "employee"
//= require "address"
//= require "phone"
//= require "email"

var Person = new JS.Class(Model, {
  extend: {
    resource: 'person',
    has_one: ['customer', 'employee', 'user'],
    has_many: ['addresses', 'emails', 'phones']
  },
  
  valid: function() {
    if(this.first_name == '' || this.first_name == undefined || this.first_name == null) {
      return false;
    }
    if(this.last_name == '' || this.last_name == undefined || this.last_name == null) {
      return false;
    }
    return true;
  }
});