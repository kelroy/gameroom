//= require "view_controller"

var TillController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    $('ul#till_nav a.select', view).bind('click', {instance: this}, this.doSelect);
    
    return this.callSuper();
  },
  
  doSelect: function(event) {
    id = $('div#till select#till_id').val();
    title = $('div#till select#till_id option:selected').html();
    event.data.instance.notifyObservers(new Till(id, title));
    event.preventDefault();
  }
});