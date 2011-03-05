//= require "../factory"
//= require "person"

var Customer = new JS.Class({
  extend: {
    find: function(id) {
      return Factory.build('customer');
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