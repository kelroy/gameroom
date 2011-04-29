//= require "../view_controller"

var InventoryOverviewResultsItemController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.item = null;
    
    $('a.delete', this.view).bind('click', {instance: this}, this.onDelete);
    $('a.edit', this.view).bind('click', {instance: this}, this.onEdit);
  },
  
  set: function(item) {
    this.item = item;
    
    if(item.description == null || item.description == undefined) {
      item.description = '';
    }
    
    $('h3.items_line_title', this.view).html(item.title);
    $('h4.items_line_description', this.view).html(item.description.truncate(30));
    $('h3.items_line_sku', this.view).html(item.sku);
    $('h3.items_line_price', this.view).html(Currency.pretty(item.price));
  },
  
  onDelete: function(event) {
    event.data.instance.item.destroy();
    event.data.instance.notifyObservers('delete', event.data.instance.item);
    event.preventDefault();
  },
  
  onEdit: function(event) {
    event.data.instance.notifyObservers('edit', event.data.instance.item);
    event.preventDefault();
  }
});