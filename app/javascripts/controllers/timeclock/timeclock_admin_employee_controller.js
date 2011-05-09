//= require "../view_controller"

var TimeclockAdminEmployeeController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();

    $('select', this.view).bind('change', {instance: this}, this.onEmployee);
  },
  
  setEmployees: function(employees) {
    $('select', this.view).empty();
    $('select', this.view).append($('<option></option>'));
    for(employee in employees) {
      $('select', this.view).append($('<option></option>').html(employees[employee].token).val(employees[employee].id));
    }
  },
  
  onEmployee: function(event) {
    id = parseInt($('select', event.data.instance.view).val());
    console.log(id);
    if(!isNaN(id)) {
      event.data.instance.notifyObservers(Employee.find(id));
    }
    event.preventDefault();
  }
});