//= require "../view_controller"

var TransactionNavController = new JS.Class(ViewController, {
  
  update: function(till) {
    $('li#transaction_nav_till', this.view).html(till.title);
    this.view.show();
  }
});