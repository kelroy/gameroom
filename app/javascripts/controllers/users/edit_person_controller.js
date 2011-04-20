//= require "../view_controller"

var EditPersonController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();

    $('select', this.view).bind('change', {instance: this}, this.onPerson);
  },
  
  onPerson: function(event) {
    id = parseInt($('select', this.view).val());
    if(!isNaN(id)) {
      event.data.instance.notifyObservers(Person.find(id));
    }
    event.preventDefault();
  }
});