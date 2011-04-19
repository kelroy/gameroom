//= require "../view_controller"

var AdminTimecardsTimecardController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.timecard = null;
    
    $('a.delete', this.view).bind('click', {instance: this}, this.onDelete);
    $('a.edit', this.view).bind('click', {instance: this}, this.onEdit);
  },
  
  set: function(timecard) {
    this.timecard = timecard;
    begin = (new Date()).setISO8601(this.timecard.begin);
    end = (new Date()).setISO8601(this.timecard.end);
    total = Math.round(((end.valueOf() - begin.valueOf()) / 3600000) *100) / 100;
    
    $('h3.timecards_line_total', this.view).html(total + ' hours');
    $('h4.timecards_line_time', this.view).html(begin.toString() + ' - ' + end.toString());
  },
  
  onDelete: function(event) {
    event.data.instance.timecard.destroy();
    event.data.instance.notifyObservers(undefined);
    event.preventDefault();
  },
  
  onEdit: function(event) {
    event.data.instance.notifyObservers(event.data.instance.timecard);
    event.preventDefault();
  }
});