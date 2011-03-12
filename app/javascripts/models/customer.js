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

  save: function(callback) {
    if(this.valid()) {
      customer = {
        credit: this.credit,
        drivers_license_number: this.drivers_license_number,
        drivers_license_state: this.drivers_license_state,
        notes: this.notes,
        active: this.active,
        person_attributes: {
          first_name: this.person.first_name,
          middle_name: this.person.middle_name,
          last_name: this.person.last_name
        }
      };

      if(customer.id == undefined || customer.id == 0) {
        $.ajax({
          url: '/api/customers',
          accept: 'application/json',
          contentType: 'application/json',
          data: JSON.stringify({customer: customer}),
          dataType: 'json',
          processData: false,
          type: 'POST',
          success: function(result) {
            console.log(result);
            callback(result.customer);
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
      } else {
        console.log('here');
        $.ajax({
          url: '/api/customers/' + this.id,
          accept: 'application/json',
          data: JSON.stringify({customer: customer}),
          type: 'PUT',
          success: function(result) {
            console.log(result);
            callback(result.customer);
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
      }
    } else {
      return false;
    }
  },
  
  valid: function() {
    return true;
  }
});