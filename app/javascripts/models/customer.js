//= require "../factory"
//= require "../factories/customer"
//= require "person"

var Customer = new JS.Class({
  extend: {
    find: function(id, callback) {
      $.ajax({
        url: '/api/customers/' + id,
        accept: 'application/json',
        success: function(results) {
          callback(results.customer);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error Status: ' + XMLHttpRequest.status);
          console.error('Error Text: ' + textStatus);
          console.error('Error Thrown: ' + errorThrown);
          console.log(XMLHttpRequest);
        },
        username: 'x',
        password: 'x',
        dataType: 'json'
      });
    },
    
    search: function(query, callback) {
      $.ajax({
        url: '/api/customers/search',
        data: {query: query},
        accept: 'application/json',
        success: function(results) {
          callback(results);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error Status: ' + XMLHttpRequest.status);
          console.error('Error Text: ' + textStatus);
          console.error('Error Thrown: ' + errorThrown);
          console.log(XMLHttpRequest);
        },
        username: 'x',
        password: 'x',
        dataType: 'json'
      });
    }
  },
  
  initialize: function(params) {
    this.id = params.id;
    if(params.person != undefined) {
      this.person = new Person(params.person);
    } else {
      this.person = undefined;
    }
    this.credit = params.credit;
    this.drivers_license_number = params.drivers_license_number;
    this.drivers_license_state = params.drivers_license_state;
    this.notes = params.notes;
    this.active = params.active;
  },

  save: function() {
    return true;
  },
  
  valid: function() {
    return this.id != null;
  }
});