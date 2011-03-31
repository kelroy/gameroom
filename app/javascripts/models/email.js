//= require "../model"
//= require "person"

var Email = new JS.Class(Model, {
  extend: {
    resource: 'email',
    columns: ['id', 'person_id', 'address'],
    belongs_to: ['person']
  },
  
  valid: function() {
    if(this.address == '' || this.address == undefined || this.address == null) {
      return false;
    }
    return true;
  }
});