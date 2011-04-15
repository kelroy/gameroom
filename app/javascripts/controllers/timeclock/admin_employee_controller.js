//= require "../view_controller"

var AdminEmployeeController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();

    $('select', this.view).bind('change', {instance: this}, this.onEmployee);
  },
  
  onEmployee: function(event) {
    id = parseInt($('select', this.view).val());
    if(!isNaN(id)) {
      event.data.instance.notifyObservers(Employee.find(id));
    }
    event.preventDefault();
  }
});