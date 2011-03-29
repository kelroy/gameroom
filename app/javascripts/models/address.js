//= require "person"

var Address = new JS.Class({
  extend: {
    find: function(id) {
      address = undefined;
      $.ajax({
        url: '/api/addresses/' + id,
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          address = new Address({
            id: results.address.id,
            person_id: results.address.person_id,
            first_line: results.address.first_line,
            second_line: results.address.second_line,
            city: results.address.city,
            state: results.address.state,
            country: results.address.country,
            zip: results.address.zip
          });
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
      return address;
    }
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.person_id = params.person_id;
    this.first_line = params.first_line;
    this.second_line = params.second_line;
    this.city = params.city;
    this.state = params.state;
    this.country = params.country;
    this.zip = params.zip;
  },
  
  person: function() {
    if(this.person_id != undefined) {
      return Person.find(this.person_id);
    } else {
      return undefined;
    }
  },

  save: function() {

  },
  
  valid: function() {
    if(this.first_line == '' || this.first_line == undefined || this.first_line == null) {
      return false;
    }
    if(this.city == '' || this.city == undefined || this.city == null) {
      return false;
    }
    if(this.state == '' || this.state == undefined || this.state == null) {
      return false;
    }
    if(this.zip == '' || this.zip == undefined || this.zip == null) {
      return false;
    }
    return true;
  }
});