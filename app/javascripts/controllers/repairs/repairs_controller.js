//= require "../view_controller"

var RepairsController = new JS.Class(ViewController, {
  
  initialize: function(view) {
    this.callSuper();
    
    this.reset();
  },
  
  reset: function() {
    
  },
  
  activate: function(user) {
    this.view.show();
  },
  
  deactivate: function() {
    this.view.hide();
  }
});