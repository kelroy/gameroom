//= require "../model"
//= require "user"
//= require "customer"
//= require "employee"
//= require "address"
//= require "phone"
//= require "email"

var Person = new JS.Class(Model, {
  extend: {
    resource: 'person'
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.user_id = params.user_id;
    this.customer_id = params.customer_id;
    this.employee_id = params.employee_id;
    this.first_name = params.first_name;
    this.middle_name = params.middle_name;
    this.last_name = params.last_name;
    this.date_of_birth = params.date_of_birth;
  },
  
  addresses: function() {
    return this._find_children('address');
  },
  
  customer: function() {
    return this._find_parent('customer');
  },
  
  emails: function() {
    return this._find_children('email');
  },
  
  employee: function() {
    return this._find_parent('employee');
  },
  
  phones: function() {
    return this._find_children('phone');
  },
  
  user: function() {
    return this._find_parent('user');
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