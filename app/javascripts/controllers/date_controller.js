//= require "view_controller"

var DateController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.reset();
    
    $('a.prev', this.view).bind('click', {instance: this}, this.onPrev);
    $('a.next', this.view).bind('click', {instance: this}, this.onNext);
    $('a.today', this.view).bind('click', {instance: this}, this.onToday);
    $('select', this.view).bind('change', {instance: this}, this.onDate);
  },
  
  update: function(date) {
    this.date = date;
    $('select#date_year option[value=' + this.date.getFullYear() + ']', this.view).attr('selected', 'selected');
    $('select#date_month option[value=' + (this.date.getMonth() + 1) + ']', this.view).attr('selected', 'selected');
    $('select#date_day option[value=' + this.date.getDate() + ']', this.view).attr('selected', 'selected');
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
    year = $('select#date_year', event.data.instance.view).val();
    month = $('select#date_month', event.data.instance.view).val();
    day = $('select#date_day', event.data.instance.view).val();
    event.data.instance.update(new Date(year, month - 1, day));
    event.data.instance.notifyObservers(event.data.instance.date);
    event.preventDefault();
  }
});