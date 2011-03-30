//= require "../model"
//= require "employee"

var Timecard = new JS.Class(Model, {
  extend: {
    resource: 'timecard',
    belongs_to: ['employee']
  },
  
  valid: function() {
    return true;
  }
});