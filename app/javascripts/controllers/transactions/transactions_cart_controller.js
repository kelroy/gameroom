//= require "../view_controller"
//= require "../search_controller"
//= require "../section_controller"
//= require "transactions_cart_form_controller"
//= require "transactions_cart_lines_controller"
//= require "transactions_cart_search_results_controller"
//= require "../../sectionable"

var TransactionsCartController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    this.cart_lines_controller = new TransactionsCartLinesController('div#transactions_cart_lines');
    this.cart_form_controller = new TransactionsCartFormController('div#transactions_cart_form');
    this.cart_search_controller = new SearchController('div#transactions_cart_search');
    this.cart_search_results_controller = new TransactionsCartSearchResultsController('div#transactions_cart_search_results');
    this.cart_section_controller = new SectionController('ul#transactions_cart_nav', [
      this.cart_lines_controller,
      this.cart_form_controller,
      this.cart_search_results_controller
    ]);
    this.cart_search_controller.addObserver(this.search, this);
    this.cart_search_controller.addObserver(this.showSearchController, this);
    this.cart_lines_controller.addObserver(this.setLines, this);
    this.cart_search_results_controller.addObserver(this.addLines, this);
    this.cart_form_controller.addObserver(this.addLines, this);
    
    this.reset();
  },
  
  reset: function() {
    this.cart_lines_controller.reset();
    this.cart_form_controller.reset();
    this.cart_search_controller.reset();
    this.cart_search_results_controller.reset();
    $('h2#transactions_cart_summary', this.view).html('0 item(s): ' + Currency.pretty(0));
    this.showLinesController();
  },
  
  search: function(query, page) {
    if(page == undefined || page == null) {
      page = 1;
    }
    if(query.length > 1) {
      keywords = query.split('|');
      if(keywords.length > 1) {
        pairs = [];
        for(keyword in keywords) {
          pair = keywords[keyword].split('~');
          if(pair.length > 1) {
            pairs.push(pair);
          }
        }
        statement = '';
        match_statements = [];
        params = [];
        for(pair in pairs) {
          match_statements.push(pairs[pair][0] + ' LIKE ?');
          params.push('%' + pairs[pair][1] + '%');
        }
        statement = match_statements.join(' AND ');
        console.log(statement);
        this.cart_search_results_controller.update(Item.where(statement, params, page, 10, this.cart_search_controller.showLoading, this.cart_search_controller.hideLoading));
      } else {
        pattern = 'title_or_description_or_sku_contains_all';
        this.cart_search_results_controller.update(Item.search(pattern, query.split(' '), page, 10, this.cart_search_controller.showLoading, this.cart_search_controller.hideLoading));
      }
    } else {
      pattern = 'title_starts_with';
      this.cart_search_results_controller.update(Item.search(pattern, query.split(' '), page, 10, this.cart_search_controller.showLoading, this.cart_search_controller.hideLoading));
    }
  },
  
  update: function(transaction) {
    $('h2#transactions_cart_summary', this.view).html(transaction.countItems() + ' item(s): ' + Currency.pretty(transaction.subtotal()));
  },
  
  showLinesController: function() {
    this.cart_section_controller.showController(0);
  },
  
  showFormController: function() {
    this.cart_section_controller.showController(1);
  },
  
  showSearchController: function() {
    this.cart_section_controller.showController(2);
  },
  
  addLines: function(lines) {
    this.cart_lines_controller.add(lines);
  },
  
  setLines: function(lines) {
    this.notifyObservers(lines);
  }
});