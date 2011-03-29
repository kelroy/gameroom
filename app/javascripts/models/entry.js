//= require "../model"

var Entry = new JS.Class(Model, {
  extend: {
    resource: 'entry'
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.till_id = params.till_id;
    this.title = params.title;
    this.description = params.description;
    this.time = params.time;
    this.amount = params.amount;
  },
  
  till: function() {
    return this._find_parent('till');
  },
  
  valid: function() {
    return true;
  }
});