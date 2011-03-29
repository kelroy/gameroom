//= require "../model"
//= require "employee"

var Timecard = new JS.Class(Model, {
  extend: {
    resource: 'timecard'
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.employee_id = params.employee_id;
    this.begin = params.begin;
    this.end = params.end;
  },
  
  employee: function() {
    return this._find_parent('employee');
  },
  
  valid: function() {
    return true;
  }
});