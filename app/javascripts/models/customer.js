//= require "../factory"
//= require "../factories/customer"
//= require "person"

var Customer = new JS.Class({
  extend: {
    find: function(id) {
      return Factory.build('Customer');
    },
    
    search: function(query) {
      results = [];
      for(i = 0; i < 5; i++){
        results.push(Factory.build('Customer'));
      }
      return results;
    }
  },
  
  initialize: function() {
    this.id = null;
    this.person = new Person();
    this.credit = null;
    this.drivers_license_number = null;
    this.drivers_license_state = null;
    this.notes = null;
    this.active = false;
  },

  save: function() {
    return true;
  },
  
  valid: function() {
    return true;
  }
});