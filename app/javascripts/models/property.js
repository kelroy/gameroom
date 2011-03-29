//= require "../model"
//= require "item"

var Property = new JS.Class(Model, {
  extend: {
    resource: 'property'
  },
  
  initialize: function(params) {
    this.id = params.id;
    this.item_id = params.item_id;
    this.key = params.key;
    this.value = params.value;
  },
  
  item: function() {
    return this._find_parent('item');
  },
  
  valid: function() {
    return true;
  }
});