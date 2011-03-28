//= require "employee"

var Timecard = new JS.Class({
  
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