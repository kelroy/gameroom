//= require "../view_controller"
//= require "../../date"

var TimeclockOverviewChartCanvasController = new JS.Class(ViewController, {
  
  initialize: function(view, user) {
    this.callSuper();
    this.user = user;
    this.timecards = [];
    
    $(this.view).bind('click', {instance: this}, this.onClick);
  },
  
  draw: function() {
    now = new Date();
    canvas = {
      'context' : this.view[0].getContext('2d'),
      'size' : {
        'width' : this.view.innerWidth(),
        'height' : this.view.innerHeight()
      }
    }
    today = {
      now: now.getTime(),
      begin: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(),
      end: (new Date(now.getFullYear(), now.getMonth(), now.getDate(), 24)).getTime()
    }
    
    $(this.view).attr('width', canvas.size.width);
    $(this.view).attr('height', canvas.size.height);
    canvas.context.fillStyle = this.view.css('color');
    canvas.context.clearRect(0,0,canvas.size.width,canvas.size.height);
    
    for(timecard in this.timecards) {
      begin = (new Date()).setISO8601(this.timecards[timecard].begin).getTime();
      if(this.timecards[timecard].end != null) {
        end = (new Date()).setISO8601(this.timecards[timecard].end).getTime();
      } else {
        end = new Date().getTime();
      }
      x = Math.round(((begin - today.begin) / (today.end - today.begin)) * canvas.size.width);
      width = Math.round(((end - today.begin) / (today.end - today.begin)) * canvas.size.width) - x;
      canvas.context.fillRect(x,0,width,canvas.size.height);
    }
  },
  
  onClick: function(event) {
    event.data.instance.timecards = event.data.instance._findTimecards(event.data.instance.user);
    event.data.instance.draw();
  },
  
  _findTimecards: function(user) {
    day_begin = new Date();
    day_end = new Date();
    day_end.setDate(day_begin.getDate() + 1);
    return Timecard.where('user_id = ? AND ((begin >= ? AND begin <= ?) OR (end >= ? AND end <= ?) OR (end IS NULL))', [user.id, day_begin.strftime('%Y-%m-%d 05:00:00'), day_end.strftime('%Y-%m-%d 04:59:59'), day_begin.strftime('%Y-%m-%d 05:00:00'), day_end.strftime('%Y-%m-%d 04:59:59')], 1, 100);
  }
});