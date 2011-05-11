//= require "../view_controller"

var TransactionsSessionNavController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    
    $('a.reset', this.view).bind('click', {instance: this}, this.onReset);
  },
  
  update: function(till) {
    $('li#transactions_session_nav_till', this.view).html(till.title);
    this.view.show();
  },
  
  onReset: function(event) {
    event.data.instance.notifyObservers('reset');
    event.preventDefault();
  }
});