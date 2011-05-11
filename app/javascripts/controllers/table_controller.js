//= require "view_controller"

var TableController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.table_row = $('tbody > tr', this.view).detach();
    this.reset();
    $('tbody > tr', this.view).live('click', {instance: this}, this.onSelect);
  },
  
  reset: function() {
    $('tbody > tr', this.view).remove();
  },
  
  update: function(data) {
    // Should be overwritten by subclass
  },
  
  onSelect: function(event) {
    $('tbody > tr', event.data.instance.view).removeClass('selected');
    $(this).addClass('selected');
    event.data.instance.notifyObservers($(this).attr('data-object-id'));
  }
});