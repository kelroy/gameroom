//= require "../model"
//= require "person"

var Customer = new JS.Class(Model, {
  extend: {
    resource: 'customer'
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.credit = params.credit;
    this.drivers_license_number = params.drivers_license_number;
    this.drivers_license_state = params.drivers_license_state;
    this.notes = params.notes;
    this.active = params.active;
  },
  
  person: function() {
    return this._find_child('person');
  },
  
  transactions: function() {
    return this._find_children('transaction');
  },
  
  valid: function() {
    if(this.credit == undefined || this.credit == null) {
      return false;
    }
    return true;
  }
});