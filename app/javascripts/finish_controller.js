//= require "view_controller"

var FinishController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    $('a', view).bind('click', {instance: this}, this.finish)
    this.callSuper();
  },
  
  finish: function(event) {
    event.data.instance.notifyObservers();
    event.preventDefault();
  },
  
  update: function(transaction) {
    if(transaction.valid()) {
      this.view.show();
    }
  }
});