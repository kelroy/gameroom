//= require "view_controller"

var SearchController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.page = 1;
    this.query = null;
    
    this.input = $('input', this.view);
    this.input.bind('change', {instance: this}, this.onChanged);
    this.alphabet_controller = new AlphabetController($('ul.alphabet_nav', this.view));
    this.alphabet_controller.addObserver(this.onLetter, this);
    $('a.clear', this.view).bind('click', {instance: this}, this.onClear);
    $('a.prev', this.view).bind('click', {instance: this}, this.onPrev);
    $('a.next', this.view).bind('click', {instance: this}, this.onNext);
    $('form', this.view).submit(function(event) {
      event.preventDefault();
    });
    this.reset();
  },
  
  reset: function() {
    this.input.val(null);
  },
  
  showLoading: function() {
    $('img.loading', this.view).show();
  },
  
  hideLoading: function() {
    $('img.loading', this.view).hide();
  },
  
  onLetter: function(letter) {
    this.input.val(letter);
    this.input.trigger('change');
  },
  
  onPrev: function(event) {
    if(event.data.instance.query != null) {
      if(event.data.instance.page > 1) {
        event.data.instance.page -= 1;
      }
      event.data.instance.notifyObservers(event.data.instance.query, event.data.instance.page);
    }
    event.preventDefault();
  },
  
  onNext: function(event) {
    if(event.data.instance.query != null) {
      event.data.instance.page += 1;
      event.data.instance.notifyObservers(event.data.instance.query, event.data.instance.page);
    }
    event.preventDefault();
  },
  
  onClear: function(event) {
    event.data.instance.page = 1;
    event.data.instance.query = null;
    event.data.instance.input.val(null);
    event.preventDefault();
  },
  
  onChanged: function(event) {
    event.data.instance.page = 1;
    event.data.instance.query = event.data.instance.input.val();
    if(event.data.instance.query.length > 0) {
      event.data.instance.notifyObservers(event.data.instance.query, 1);
    }
    event.preventDefault();
  }
});