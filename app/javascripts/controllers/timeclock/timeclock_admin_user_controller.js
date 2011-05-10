//= require "../view_controller"

var TimeclockAdminUserController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();

    $('select', this.view).bind('change', {instance: this}, this.onUser);
  },
  
  setUsers: function(users) {
    $('select', this.view).empty();
    $('select', this.view).append($('<option></option>'));
    for(user in users) {
      $('select', this.view).append($('<option></option>').html(users[user].token).val(users[user].id));
    }
  },
  
  onUser: function(event) {
    id = parseInt($('select', event.data.instance.view).val());
    console.log(id);
    if(!isNaN(id)) {
      event.data.instance.notifyObservers(User.find(id));
    }
    event.preventDefault();
  }
});