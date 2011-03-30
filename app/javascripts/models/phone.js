//= require "../model"
//= require "person"

var Phone = new JS.Class(Model, {
  extend: {
    resource: 'phone',
    belongs_to: ['person']
  },
  
  valid: function() {
    if(this.number == '' || this.number == undefined || this.number == null) {
      return false;
    }
    return true;
  }
});