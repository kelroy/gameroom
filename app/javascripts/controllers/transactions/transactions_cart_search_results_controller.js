//= require "../../sectionable"
//= require "../../models/line"
//= require "../../models/item"
//= require "transactions_cart_table_controller"

var TransactionsCartSearchResultsController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    this.cart_table_controller = new TransactionsCartTableController($('table#transactions_cart_search_results_table', this.view));
    this.cart_table_controller.addObserver(this.onItem, this);
  },
  
  reset: function() {
    this.cart_table_controller.reset();
  },
  
  update: function(results) {
    if(results.length > 0) {
      $('h2#transactions_cart_search_results_notice').hide();
    } else {
      $('h2#transactions_cart_search_results_notice').show();
    }
    this.cart_table_controller.update(results);
  },
  
  onItem: function(id) {
    item = Item.find(id);
    this.notifyObservers([new Line({
      item_id: item.id,
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