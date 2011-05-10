//= require "../view_controller"

var UsersOverviewSelectController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();

    $('select', this.view).bind('change', {instance: this}, this.onUser);
  },
  
  reset: function() {
    $('select', this.view).val(0);
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
    if(!isNaN(id)) {
      event.data.instance.notifyObservers(User.find(id));
    }
    event.preventDefault();
  }
});