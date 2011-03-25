//= require "../factory"
//= require "../factories/customer"
//= require "person"

var Customer = new JS.Class({
  extend: {
    find: function(id, callback) {
      $.ajax({
        url: '/api/customers/' + id,
        accept: 'application/json',
        dataType: 'json',
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
        password: 'x'
      });
    },
    
    search: function(query, page, callback) {
      if(query.length > 1) {
        search = { person_first_name_or_person_last_name_contains_any: query.split(" ") };
      } else {
        search = { person_last_name_starts_with: query };
      }
      
      $.ajax({
        url: '/api/customers/search',
        data: JSON.stringify({
          search: search,
          page: page,
          per_page: 10
        }),
        dataType: 'json',
        accept: 'application/json',
        contentType: 'application/json',
        processData: false,
        type: 'POST',
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
        password: 'x'
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
        active: this.active
      };
      
      if(this.person != undefined) {
        customer.person_attributes = {
          first_name: this.person.first_name,
          middle_name: this.person.middle_name,
          last_name: this.person.last_name,
          emails_attributes: [],
          addresses_attributes: [],
          phones_attributes: []
        }
        for(email in this.person.emails) {
          customer.person_attributes.emails_attributes.push({
            address: this.person.emails[email].address
          });
        }
        for(address in this.person.addresses) {
          customer.person_attributes.addresses_attributes.push({
            first_line: this.person.addresses[address].first_line,
            second_line: this.person.addresses[address].second_line,
            city: this.person.addresses[address].city,
            state: this.person.addresses[address].state,
            country: this.person.addresses[address].country,
            zip: this.person.addresses[address].zip
          });
        }
        for(phone in this.person.phones) {
          customer.person_attributes.phones_attributes.push({
            title: this.person.phones[phone].title,
            number: this.person.phones[phone].number
          });
        }
      }

      if(this.id == undefined || this.id == 0) {
        url = '/api/customers';
        type = 'POST';
      } else {
        url = '/api/customers/' + this.id;
        type = 'PUT';
      }
      
      $.ajax({
        url: url,
        accept: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify({customer: customer}),
        dataType: 'json',
        processData: false,
        type: type,
        success: function(result) {
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
      
      return true;
    } else {
      return false;
    }
  },
  
  valid: function() {
    if(this.credit == undefined || this.credit == null) {
      return false;
    }
    if(this.person != undefined) {
      if(!this.person.valid()) {
        return false;
      }
    }
    return true;
  }
});