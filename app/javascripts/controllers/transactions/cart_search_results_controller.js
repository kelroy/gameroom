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
    if(query.length > 1) {
      pattern = 'title_or_description_or_sku_contains_all';
    } else {
      pattern = 'title_starts_with';
    }
    this.cart_table_controller.update(Item.where(pattern, query, page, 10));
  },
  
  onItem: function(id) {
    item = Item.find(id);
    this.notifyObservers([new Line({
      title: item.title,
      description: item.description,
      quantity: 1,
      condition: 1,
      discount: 1,
      price: item.price,
      credit: item.credit,
      cash: item.cash,
      purchase: true,
      taxable: item.taxable,
      discountable: item.discountable
    })]);
  }
});