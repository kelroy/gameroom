//= require "../view_controller"

var TerminalUserController = new JS.Class(ViewController, {
  
  initialize: function(view) {
    this.callSuper();
  },
  
  update: function(till) {
    $('li.current_user_till', this.view).html(till.title);
  }
});