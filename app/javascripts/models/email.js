//= require "../model"
//= require "person"

var Email = new JS.Class(Model, {
  extend: {
    resource: 'email'
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.person_id = params.person_id;
    this.address = params.address;
  },
  
  person: function() {
    return this._find_parent('person');
  },
  
  valid: function() {
    if(this.address == '' || this.address == undefined || this.address == null) {
      return false;
    }
    return true;
  }
});