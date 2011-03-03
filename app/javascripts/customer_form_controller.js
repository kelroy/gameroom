//= require "view_controller"
//= require "customer"

var CustomerFormController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.customer = new Customer();
    this.reset();
    this.callSuper();
  },
  
  reset: function() {
    
  }
});