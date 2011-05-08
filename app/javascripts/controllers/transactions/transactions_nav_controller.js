//= require "../view_controller"

var TransactionsNavController = new JS.Class(ViewController, {
  
  update: function(till) {
    $('li#transactions_nav_till', this.view).html(till.title);
    this.view.show();
  }
});