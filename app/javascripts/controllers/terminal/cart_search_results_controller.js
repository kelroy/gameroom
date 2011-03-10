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
    this.cart_table_controller.update(Item.search(query));
  },
  
  onItem: function(id) {
    line = new Line();
    line.item = Item.find(id);
    line.sell = false;
    line.condition = 5;
    line.quantity = 1;
    this.notifyObservers([line]);
  }
});