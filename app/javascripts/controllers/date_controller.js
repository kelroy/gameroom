//= require "view_controller"

var DateController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.date = new Date();
    
    $('a.prev', this.view).bind('click', {instance: this}, this.onPrev);
    $('a.next', this.view).bind('click', {instance: this}, this.onNext);
    $('a.today', this.view).bind('click', {instance: this}, this.onToday);
    $('select', this.view).bind('change', {instance: this}, this.onDate);
  },
  
  update: function(date) {
    this.date = date;
  },

  reset: function() {
    this.update(new Date());
  },
  
  onPrev: function(event) {
    event.data.instance.update(new Date(event.data.instance.date.valueOf() - (60 * 60 * 24 * 1000)));
    event.data.instance.notifyObservers(event.data.instance.date);
    event.preventDefault();
  },
  
  onNext: function(event) {
    event.data.instance.update(new Date(event.data.instance.date.valueOf() + (60 * 60 * 24 * 1000)));
    event.data.instance.notifyObservers(event.data.instance.date);
    event.preventDefault();
  },
  
  onToday: function(event) {
    event.data.instance.update(new Date());
    event.data.instance.notifyObservers(event.data.instance.date);
    event.preventDefault();
  },
  
  onDate: function(event) {
    event.data.instance.notifyObservers(event.data.instance.date);
    event.preventDefault();
  }
});