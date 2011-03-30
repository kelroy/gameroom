//= require "../model"

var Entry = new JS.Class(Model, {
  extend: {
    resource: 'entry',
    belongs_to: ['till']
  },
  
  valid: function() {
    return true;
  }
});