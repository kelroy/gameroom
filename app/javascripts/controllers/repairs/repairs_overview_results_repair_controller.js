//= require "../view_controller"

var RepairsOverviewResultsRepairController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.repair = null;
    
    $('a.edit', this.view).bind('click', {instance: this}, this.onEdit);
    $('a.print', this.view).bind('click', {instance: this}, this.onPrint);
  },
  
  set: function(repair) {
    this.repair = repair;
    
    $('td.name', this.view).html(repair.name);
    $('td.phone', this.view).html(repair.phone);
    $('td.title', this.view).html(repair.title);
    $('td.serial', this.view).html(repair.serial);
    $('td.description', this.view).html(repair.description);
    $('td.symptoms', this.view).html(repair.symptoms);
    $('td.notes', this.view).html(repair.notes);
    $('td.warranty', this.view).html(repair.warranty);
    $('td.cost', this.view).html(Currency.pretty(repair.cost));
  },
  
  onEdit: function(event) {
    event.data.instance.notifyObservers('edit', event.data.instance.repair);
    event.preventDefault();
  },
  
  onPrint: function(event) {
    event.data.instance.notifyObservers('print', event.data.instance.repair);
    event.preventDefault();
  }
});