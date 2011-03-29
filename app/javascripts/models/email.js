//= require "person"

var Email = new JS.Class({
  extend: {
    find: function(id) {
      email = undefined;
      $.ajax({
        url: '/api/emails/' + id,
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          email = new Email({
            id: results.email.id,
            person_id: results.email.person_id,
            address: results.email.address
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
      return email;
    }
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.person_id = params.person_id;
    this.address = params.address;
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
    if(this.address == '' || this.address == undefined || this.address == null) {
      return false;
    }
    return true;
  }
});