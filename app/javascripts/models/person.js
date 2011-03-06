var Person = new JS.Class({
  
  initialize: function() {
    this.id = null;
    this.first_name = null;
    this.middle_name = null;
    this.last_name = null;
    this.date_of_birth = null;
    this.addresses = [];
    this.phones = [];
    this.emails = [];
  },

  save: function() {
    
  },
  
  valid: function() {
    return true;
  }
});