//= require "../view_controller"
//= require "../../models/till"

var TillController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    $('ul#till_nav a.select', view).bind('click', {instance: this}, this.doSelect);
  },
  
  doSelect: function(event) {
    Till.find($('div#till select#till_id').val(), function(till) {
      if(till != null) {
        event.data.instance.notifyObservers(new Till(till));
      }
    });
    event.preventDefault();
  }
});