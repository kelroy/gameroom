//= require "view_controller"

var CustomerSearchController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.reset();
    
    this.customer_query = $('input#customer_query', this.view);
    this.customer_query.bind('change', {instance: this}, this.onChange);
    this.alphabet_controller = new AlphabetController('div#customer_search ul.alphabet_nav', this.customer_query);
    this.alphabet_controller.addObserver(this.onLetter, this);
  },
  
  reset: function() {
    $(this.customer_query).val(null);
  },
  
  onLetter: function(letter) {
    $(this.customer_query).val(letter);
    $(this.customer_query).trigger('change');
  },
  
  onChange: function(event) {
    event.data.instance.notifyObservers($(this.customer_query).val());
    event.preventDefault();
  }
});