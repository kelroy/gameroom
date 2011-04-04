//= require "../view_controller"
//= require "../../models/till"

var TillController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    $('ul#till_nav a.select', view).bind('click', {instance: this}, this.doSelect);
  },
  
  doSelect: function(event) {
    event.data.instance.notifyObservers(Till.find($('div#till select#till_id').val()));
    event.preventDefault();
  }
});