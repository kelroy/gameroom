//= require "../model"

var Payment = new JS.Class(Model, {
  extend: {
    resource: 'payment',
    belongs_to: ['transaction']
  },
  
  valid: function() {
    return true;
  }
});