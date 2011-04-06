//= require "../view_controller"

var TransactionFinishController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.enabled = false;
    $('a', view).bind('click', {instance: this}, this.finish);
  },
  
  reset: function() {
    this.view.show();
  },
  
  enable: function() {
    $('a', this.view).removeClass('disabled');
    this.enabled = true;
  },
  
  disable: function() {
    $('a', this.view).addClass('disabled');
    this.enabled = false;
  },
  
  finish: function(event) {
    if(event.data.instance.enabled) {
      event.data.instance.notifyObservers();
    }
    event.preventDefault();
  },
  
  update: function(transaction) {
    if(transaction.finishable()) {
      this.enable();
    } else {
      this.disable();
    }
  }
});