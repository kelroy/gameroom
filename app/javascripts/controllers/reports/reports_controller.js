//= require "../view_controller"

var ReportsController = new JS.Class(ViewController, {
  
  initialize: function(view) {
    this.callSuper();
    
    this.reset();
  },
  
  reset: function() {
    
  },
  
  activate: function() {
    this.view.show();
  },
  
  deactivate: function() {
    this.view.hide();
  }
});