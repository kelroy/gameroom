//= require "../model"
//= require "person"

var Phone = new JS.Class(Model, {
  extend: {
    resource: 'phone'
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.person_id = params.person_id;
    this.title = params.title;
    this.number = params.number;
  },
  
  person: function() {
    return this._find_parent('person');
  },
  
  valid: function() {
    if(this.number == '' || this.number == undefined || this.number == null) {
      return false;
    }
    return true;
  }
});