//= require "../model"
//= require "entry"

var Till = new JS.Class(Model, {
  extend: {
    resource: 'till',
    has_many: ['entries', 'transactions']
  },
  
  valid: function() {
    return true;
  }
});