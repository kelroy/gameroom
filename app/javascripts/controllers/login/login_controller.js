//= require "../form_controller"

var LoginController = new JS.Class(FormController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.reset();
    
    $('a.login', this.view).bind('click', {instance: this}, this.onLogin);
  },
  
  activate: function(user) {
    this.view.show();
  },
  
  deactivate: function() {
    this.view.hide();
  },
  
  onLogin: function(event) {
    username = $('input#username', event.data.instance.view).val();
    password = $('input#password', event.data.instance.view).val();
    user = User.authenticate(username, password);
    
    if(user != null) {
      event.data.instance.notifyObservers(user);
      event.data.instance.reset();
    }
    event.preventDefault();
  }
});