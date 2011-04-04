//= require "../view_controller"

var AdminController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.reset();
  },
  
  reset: function() {
  }
});