//= require "../model"
//= require "user"
//= require "customer"

var Person = new JS.Class(Model, {
  extend: {
    resource: 'person',
    columns: ['id', 'first_name', 'middle_name', 'last_name', 'date_of_birth', 'drivers_license', 'ssn', 'addresses', 'emails', 'phones'],
    has_one: ['customer', 'user']
  }
});