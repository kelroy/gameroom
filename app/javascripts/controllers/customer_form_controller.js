//= require "form_controller"

var CustomerFormController = new JS.Class(FormController, {
  
  initialize: function(view) {
    this.callSuper();
  },
  
  update: function(customer) {
    // Do customer update
  },
  
  save: function() {
    // Do customer save
    this.notifyObservers(new Customer());
  },
  
  onClear: function(event) {
    event.data.instance.reset();
    event.preventDefault();
  }
});