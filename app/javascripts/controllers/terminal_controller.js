//= require "till_controller"
//= require "transaction_controller"

var TerminalController = new JS.Class({
  
  initialize: function() {
    
    this.transaction_controller = new TransactionController();
    this.till_controller = new TillController('div#till');
    this.user_nav = $('ul#user_nav').hide();
    
    this.till_controller.view.show();
    this.till_controller.addObserver(this.updateTill, this);
    
    // Prevent all forms from doing page requests
    $('form').submit(function(event) {
      event.preventDefault();
    });
  },
  
  updateTill: function(till) {
    this.transaction_controller.newTransaction(till);
    $('li.current_user_till', this.user_nav).html(till.title);
    $(this.user_nav).show();
    this.till_controller.view.hide();
  }
});