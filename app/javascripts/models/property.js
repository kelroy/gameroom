//= require "item"

var Property = new JS.Class({
  
  initialize: function(params) {
    this.id = params.id;
    if(params.item != undefined) {
      if(this.item == undefined) {
        this.item = new Item(params.item);
      }
    } else {
      this.item = undefined;
    }
    this.key = params.key;
    this.value = params.value;
  },
  
  save: function() {
    
  },
  
  valid: function() {
    return true;
  }
});