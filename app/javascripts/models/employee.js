//= require "../model"

var Employee = new JS.Class(Model, {
  extend: {
    resource: 'employee',
    belongs_to: ['person'],
    has_many: ['timecards']
  },
  
  valid: function() {
    return true;
  }
});