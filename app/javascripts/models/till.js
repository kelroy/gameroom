//= require "../factory"
//= require "../factories/till"

var Till = new JS.Class({
  extend: {
    find: function(id, callback) {
      $.ajax({
        url: '/api/tills/' + id,
        accept: 'application/json',
        success: function(results) {
          callback(results.till);
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
    this.title = params.title;
  },
  
  valid: function() {
    return true;
  }
});