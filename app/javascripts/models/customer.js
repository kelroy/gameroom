//= require "../model"
//= require "person"

var Customer = new JS.Class(Model, {
  extend: {
    resource: 'customer',
    belongs_to: ['person'],
    has_many: ['transactions']
  },
  
  valid: function() {
    return true;
  }
});