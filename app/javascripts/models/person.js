//= require "../model"
//= require "employee"
//= require "customer"

var Person = new JS.Class(Model, {
  extend: {
    resource: 'person',
    columns: ['id', 'first_name', 'middle_name', 'last_name', 'date_of_birth'],
    has_one: ['customer', 'employee']
  }
});