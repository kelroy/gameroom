//= require "view_controller"

var SearchController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    
    this.query = $('input.query', this.view);
    this.query.bind('change', {instance: this}, this.onChange);
    this.alphabet_controller = new AlphabetController($('ul.alphabet_nav', this.view));
    this.alphabet_controller.addObserver(this.onLetter, this);
    $('a.clear', this.view).bind('click', {instance: this}, this.onClear);
    $('form', this.view).submit(function(event) {
      event.preventDefault();
    });
    this.reset();
  },
  
  reset: function() {
    this.query.val(null);
  },
  
  onLetter: function(letter) {
    this.query.val(letter);
    this.query.trigger('change');
  },
  
  onClear: function(event) {
    event.data.instance.query.val(null);
    event.preventDefault();
  },
  
  onChange: function(event) {
    event.data.instance.notifyObservers(event.data.instance.query.val());
    event.preventDefault();
  }
});