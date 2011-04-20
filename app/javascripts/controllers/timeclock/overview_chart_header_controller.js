//= require "../view_controller"

var OverviewChartHeaderController = new JS.Class(ViewController, {
  
  draw: function() {
    canvas = {
      'context' : this.view[0].getContext('2d'),
      'size' : {
        'width' : this.view.innerWidth(),
        'height' : this.view.innerHeight()
      }
    }
    
    $(this.view).attr('width', canvas.size.width);
    $(this.view).attr('height', canvas.size.height);
    
    canvas.context.lineWidth = 1;
    canvas.context.font = "bold 8px sans-serif";
    canvas.context.textAlign = "center";
    canvas.context.textBaseline = "middle";
    
    canvas.context.clearRect(0, 0, canvas.size.width, canvas.size.height);
    
    canvas.context.strokeStyle = "#999999";
    canvas.context.beginPath();
    canvas.context.moveTo(0, Math.round(canvas.size.height / 2));
    canvas.context.lineTo(canvas.size.width, Math.round(canvas.size.height / 2));
    canvas.context.stroke();
    
    for(i = 0; i <= 48; i++) {
      x = Math.round((canvas.size.width / 48) * i);
      hour = null;
      
      if(i % 2 == 0) {
        y_begin = 2;
        if(i != 0 && i != 48) {
          hour = i / 2;
          if(hour > 12) {
            hour -= 12;
          }
        }
      } else {
        y_begin = 10;
      }
      y_end = canvas.size.height - y_begin;
      
      canvas.context.strokeStyle = "#999999";
      canvas.context.beginPath();
      canvas.context.moveTo(x, y_begin);
      canvas.context.lineTo(x, y_end);
      canvas.context.stroke();
      
      if(i % 2 == 0 && i != 0 && i != 48) {
        canvas.context.fillStyle = "#FFFFFF";
        canvas.context.beginPath();
        canvas.context.arc(x, Math.round(canvas.size.height / 2), 7, 0, Math.PI * 2, true);
        canvas.context.fill();
      }
      
      if(hour != null) {
        canvas.context.fillStyle = "#000000";
        canvas.context.fillText(hour, x, Math.round(canvas.size.height / 2));
      }
    }
  }
});