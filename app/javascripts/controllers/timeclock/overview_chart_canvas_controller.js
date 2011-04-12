//= require "../view_controller"
//= require "../../date"

var OverviewChartCanvasController = new JS.Class(ViewController, {
  
  initialize: function(view, timecards) {
    this.callSuper();
    this.timecards = timecards;
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
      }
      x = Math.round(((begin - today.begin) / (today.end - today.begin)) * canvas.size.width);
      width = Math.round(((end - today.begin) / (today.end - today.begin)) * canvas.size.width) - x;
      //console.log(((begin - today.begin) / (today.end - today.begin)));
      //console.log([begin,end,x,width]);
      canvas.context.fillRect(x,0,width,canvas.size.height);
    }
  }
});