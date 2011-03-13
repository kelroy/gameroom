//= require "cart_table_controller"
//= require "../../models/line"
//= require "../../models/item"

var CartSearchResultsController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.cart_table_controller = new CartTableController($('table', this.view));
    this.cart_table_controller.addObserver(this.onItem, this);
  },
  
  reset: function() {
    this.cart_table_controller.reset();
  },
  
  search: function(query) {
    controller = this;
    Item.search(query, function(items) {
      items_results = [];
      for(item in items) {
        items_results.push(new Item(items[item].item));
      }
      controller.cart_table_controller.update(items_results);
    });
  },
  
  onItem: function(id) {
    controller = this;
    Item.find(id, function(item) {
      if(item != null) {
        line = new Line({});
        line.item = new Item(item);
        line.sell = false;
        line.condition = 5;
        line.quantity = 1;
        controller.notifyObservers([new Line(line)]);
      }
    });
  }
});