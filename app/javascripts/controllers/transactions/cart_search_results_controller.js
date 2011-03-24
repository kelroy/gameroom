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
  
  search: function(query, page) {
    if(page == undefined || page == null) {
      page = 1;
    }
    controller = this;
    Item.search(query, page, function(items) {
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
        line = new Line({
          sell: false,
          condition: 1,
          quantity: 1,
          taxable: item.taxable,
          item: item,
        });
        controller.notifyObservers([new Line(line)]);
      }
    });
  }
});