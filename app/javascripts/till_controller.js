//= require "view_controller"

var TillController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    $('ul#till_nav a.select', view).bind('click', {instance: this}, this.doSelect);
    
    return this.callSuper();
  },
  
  doSelect: function(event) {
    // Get till id from select list and find till
    event.data.instance.notifyObservers(new Till(0, 'Title'));
    event.preventDefault();
  }
});