//= require "view_controller"

var CartLinesController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
  },
  
  reset: function() {
    
  },
  
  update: function(items) {
    // Turn items in update into lines
  }
});