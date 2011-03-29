//= require "../model"

var Employee = new JS.Class(Model, {
  extend: {
    resource: 'employee'
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.title = params.title;
    this.rate = params.rate;
    this.active = params.active;
  },
  
  person: function() {
    return this._find_child('person');
  },
  
  timecards: function() {
    return this._find_children('timecard');
  },
  
  valid: function() {
    return true;
  }
});