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
    
    $('h3.timecards_line_time', this.view).html(begin.toLocaleTimeString() + ' - ' + end.toLocaleTimeString());
  },
  
  onDelete: function(event) {
    event.preventDefault();
  },
  
  onEdit: function(event) {
    event.preventDefault();
  }
});