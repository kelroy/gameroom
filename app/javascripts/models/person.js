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
    columns: ['id', 'first_name', 'middle_name', 'last_name', 'date_of_birth'],
    has_one: ['customer', 'employee', 'user'],
    has_many: ['addresses', 'emails', 'phones']
  },
  
  valid: function() {
    return true;
  }
});