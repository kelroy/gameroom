//= require "person"

var Phone = new JS.Class({
  
  initialize: function(params) {
    this.id = params.id;
    if(params.person != undefined) {
      if(this.person == undefined) {
        this.person = new Person(params.person);
      }
    } else {
      this.person = undefined;
    }
    this.title = params.title;
    this.number = params.number;
  },

  save: function() {
    
  },
  
  valid: function() {
    if(this.number == '' || this.number == undefined || this.number == null) {
      return false;
    }
    return true;
  }
});