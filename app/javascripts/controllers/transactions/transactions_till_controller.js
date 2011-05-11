//= require "../view_controller"
//= require "../../models/till"

var TransactionsTillController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    $('ul#tills_till_nav a.select', view).bind('click', {instance: this}, this.doSelect);
  },
  
  present: function(tills) {
    $('select#till', this.view).empty();
    for(till in tills) {
      $('select#till', this.view).append($('<option></option>').html(tills[till].title).val(tills[till].id));
    }
    this.view.show();
  },
  
  doSelect: function(event) {
    id = $('select#till', event.data.instance.view).val();
    event.data.instance.notifyObservers(Till.find(id));
    event.data.instance.view.hide();
    event.preventDefault();
  }
});