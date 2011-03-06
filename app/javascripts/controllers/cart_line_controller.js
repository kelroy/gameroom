//= require "view_controller"

var CartLineController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view, line) {
    this.callSuper();
    this.line = line;
    this.update(this.line);
    $('a.remove', this.view).bind('click', {instance: this}, this.onRemove);
  },
  
  update: function(line) {
    
  },
  
  onRemove: function(event) {
    event.data.instance.line.quantity = 0;
    event.data.instance.notifyObservers(event.data.instance.line);
    event.preventDefault();
  },
});