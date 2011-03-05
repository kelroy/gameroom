//= require "view_controller"

var CartSearchController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.reset();
    
    this.cart_query = $('input#cart_query', this.view);
    this.cart_query.bind('change', {instance: this}, this.onChange);
    this.alphabet_controller = new AlphabetController('div#cart_search ul.alphabet_nav', this.cart_query);
    this.alphabet_controller.addObserver(this.onLetter, this);
  },
  
  reset: function() {
    $(this.cart_query).val(null);
  },
  
  onLetter: function(letter) {
    $(this.cart_query).val(letter);
    $(this.cart_query).trigger('change');
  },
  
  onChange: function(event) {
    event.data.instance.notifyObservers($(this.cart_query).val());
    event.preventDefault();
  }
});