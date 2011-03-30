//= require "../model"
//= require "person"

var Customer = new JS.Class(Model, {
  extend: {
    resource: 'customer',
    belongs_to: ['person'],
    has_many: ['transactions']
  },
  
  valid: function() {
    if(this.credit == undefined || this.credit == null) {
      return false;
    }
    return true;
  }
});