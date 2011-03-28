//= require "user"
//= require "customer"
//= require "employee"
//= require "address"
//= require "phone"
//= require "email"

var Person = new JS.Class({
  extend: {
    find: function(id) {
      person = undefined;
      $.ajax({
        url: '/api/people/' + id,
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          person = results.person;
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
      return person;
    }
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

  save: function() {

  },
  
  valid: function() {
    if(this.first_name == '' || this.first_name == undefined || this.first_name == null) {
      return false;
    }
    if(this.last_name == '' || this.last_name == undefined || this.last_name == null) {
      return false;
    }
    for(address in this.addresses) {
      if(!this.addresses[address].valid()) {
        return false;
      }
    }
    for(phone in this.phones) {
      if(!this.phones[phone].valid()) {
        return false;
      }
    }
    for(email in this.emails) {
      if(!this.emails[email].valid()) {
        return false;
      }
    }
    return true;
  }
});