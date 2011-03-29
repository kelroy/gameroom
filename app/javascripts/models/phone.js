//= require "person"

var Phone = new JS.Class({
  extend: {
    find: function(id) {
      phone = undefined;
      $.ajax({
        url: '/api/phones/' + id,
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          phone = new Phone({
            id: results.phone.id,
            person_id: results.phone.person_id,
            title: results.phone.title,
            number: results.phone.number
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
      return phone;
    }
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.person_id = params.person_id;
    this.title = params.title;
    this.number = params.number;
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
    if(this.number == '' || this.number == undefined || this.number == null) {
      return false;
    }
    return true;
  }
});