//= require "../view_controller"

var TimecardController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.employee = null;
    this.timecard = null;
    
    $('a.close', this.view).bind('click', {instance: this}, this.onClose);
    $('a.save', this.view).bind('click', {instance: this}, this.onSave);
  },
  
  setEmployee: function(employee) {
    this.employee = employee;
  },
  
  setTimecard: function(timecard) {
    this.timecard = timecard;
    if(timecard != null) {
      begin = (new Date()).setISO8601(timecard.begin);
      end = (new Date()).setISO8601(timecard.end);
      begin_year = begin.getFullYear();
      begin_month = begin.getMonth() + 1;
      begin_day = begin.getDate();
      begin_hour = begin.getHours();
      begin_minute = begin.getMinutes();
      begin_second = begin.getSeconds();
      end_year = end.getFullYear();
      end_month = end.getMonth() + 1;
      end_day = end.getDate();
      end_hour = end.getHours();
      end_minute = end.getMinutes();
      end_second = end.getSeconds();
    } else {
      now = new Date();
      begin_year = now.getFullYear();
      begin_month = now.getMonth() + 1;
      begin_day = now.getDate();
      begin_hour = now.getHours();
      begin_minute = now.getMinutes();
      begin_second = now.getSeconds();
      end_year = now.getFullYear();
      end_month = now.getMonth() + 1;
      end_day = now.getDate();
      end_hour = now.getHours();
      end_minute = now.getMinutes();
      end_second = now.getSeconds();
    }
    $('select#begin_year').val(begin_year);
    $('select#begin_month').val(begin_month);
    $('select#begin_day').val(begin_day);
    $('select#begin_hour').val(this._padNumber(begin_hour));
    $('select#begin_minute').val(this._padNumber(begin_minute));
    $('select#begin_second').val(this._padNumber(begin_second));
    $('select#end_year').val(end_year);
    $('select#end_month').val(end_month);
    $('select#end_day').val(end_day);
    $('select#end_hour').val(this._padNumber(end_hour));
    $('select#end_minute').val(this._padNumber(end_minute));
    $('select#end_second').val(this._padNumber(end_second));
  },
  
  onClose: function(event) {
    event.data.instance.view.hide();
    event.preventDefault();
  },
  
  onSave: function(event) {
    begin_year = $('select#begin_year').val();
    begin_month = $('select#begin_month').val() - 1;
    begin_day = $('select#begin_day').val();
    begin_hour = $('select#begin_hour').val();
    begin_minute = $('select#begin_minute').val();
    begin_second = $('select#begin_second').val();
    end_year = $('select#end_year').val();
    end_month = $('select#end_month').val() - 1;
    end_day = $('select#end_day').val();
    end_hour = $('select#end_hour').val();
    end_minute = $('select#end_minute').val();
    end_second = $('select#end_second').val();
    
    begin = new Date(begin_year, begin_month, begin_day, begin_hour, begin_minute, begin_second);
    end = new Date(end_year, end_month, end_day, end_hour, end_minute, end_second);
    if(event.data.instance.timecard == null) {
      timecard = Timecard.create({
        employee_id: event.data.instance.employee.id,
        begin: begin,
        end: end
      });
    } else {
      timecard = Timecard.find(event.data.instance.timecard.id);
      timecard.begin = begin;
      timecard.end = end;
      timecard.save();
    }
    event.data.instance.notifyObservers();
    event.data.instance.view.hide();
    event.preventDefault();
  },
  
  _padNumber: function(number) {
    if(number < 10) {
      return '0' + number;
    } else {
      return number;
    }
  }
});