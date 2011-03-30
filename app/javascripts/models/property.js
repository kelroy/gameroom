//= require "../model"
//= require "item"

var Property = new JS.Class(Model, {
  extend: {
    resource: 'property',
    belongs_to: ['item']
  },
  
  valid: function() {
    return true;
  }
});