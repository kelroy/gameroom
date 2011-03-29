//= require "../model"
//= require "entry"

var Till = new JS.Class(Model, {
  extend: {
    resource: 'till'
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.title = params.title;
    this.description = params.description;
    this.minimum_transfer = params.minimum_transfer;
    this.minimum_balance = params.minimum_balance;
    this.retainable = params.retainable;
    this.active = params.active;
  },
  
  transactions: function() {
    return this._find_children('transaction');
  },
  
  entries: function() {
    return this._find_children('entry');
  },
  
  valid: function() {
    return true;
  }
});