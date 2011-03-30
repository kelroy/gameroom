//= require "../model"
//= require "person"

var Email = new JS.Class(Model, {
  extend: {
    resource: 'email',
    belongs_to: ['person']
  },
  
  valid: function() {
    if(this.address == '' || this.address == undefined || this.address == null) {
      return false;
    }
    if(this.person_id == '' || this.person_id == undefined || this.person_id == null) {
      return false;
    }
    return true;
  }
});