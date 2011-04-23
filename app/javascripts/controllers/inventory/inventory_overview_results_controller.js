//= require "../../sectionable"
//= require "../view_controller"
//= require "inventory_item_controller"
//= require "inventory_overview_results_item_controller"

var InventoryOverviewResultsController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    this.items = [];
    this.item_controllers = [];
    this.item = $('li.items_line', this.view).detach();
  },
  
  reset: function() {
    this.items = [];
    this.item_controllers = [];
    this.clearItems();
  },
  
  update: function(items) {
    this.setItems(items);
  },
  
  clearItems: function() {
    $('ul#items_lines > li').remove();
  },
  
  setItems: function(items) {
    this.clearItems();
    this.items = items;
    this.item_controllers = [];
    for(item in items) {
      new_item = new InventoryOverviewResultsItemController(this.item.clone());
      new_item.set(items[item]);
      new_item.addObserver(this.updateItem, this);
      this.item_controllers.push(new_item);
      $('ul#items_lines', this.view).append(new_item.view);
    }
    if(items.length > 0) {
      this.hideNotice();
    } else {
      this.showNotice();
    }
  },
  
  updateItem: function(action, item) {
    switch(action) {
      case 'edit':
        this.notifyObservers(item);
        break;
      case 'delete':
        this.removeItem(item);
        break;
    }
  },
  
  removeItem: function(remove_item) {
    for(item in this.items) {
      if(remove_item.id == this.items[item].id) {
        this.items.splice(item, 1);
      }
    }
    this.setItems(this.items);
  },
  
  showNotice: function() {
    $('h2#items_notice', this.view).show();
  },
  
  hideNotice: function() {
    $('h2#items_notice', this.view).hide();
  }
});