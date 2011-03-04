//= require "form_controller"

var CartFormController = new JS.Class(FormController, {
  
  initialize: function(view) {
    this.callSuper();
  },
  
  save: function() {
    // Do cart save
    this.notifyObservers();
  },
  
  onClear: function(event) {
    event.data.instance.reset();
    event.preventDefault();
  }
});