//= require "person"

var Customer = new JS.Class({
  extend: {
    find: function(id) {
      return new Customer();
    },
    
    search: function(query) {
      return [];
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
    
  }
});