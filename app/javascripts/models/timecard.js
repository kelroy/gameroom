//= require "employee"

var Timecard = new JS.Class({
  extend: {
    find: function(id) {
      timecard = undefined;
      $.ajax({
        url: '/api/timecards/' + id,
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          timecard = results.timecard;
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
      return timecard;
    }
  },
  
  initialize: function(params) {
    this.id = params.id;
    if(params.employee != undefined) {
      if(this.employee == undefined) {
        this.employee = new Employee(params.employee);
      }
    } else {
      this.employee = undefined;
    }
    this.begin = params.begin;
    this.end = params.end;
  },
  
  save: function() {
    
  },
  
  valid: function() {
    return true;
  }
});