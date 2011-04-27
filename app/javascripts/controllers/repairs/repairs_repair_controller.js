//= require "../view_controller"

var RepairsRepairController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.repair = null;
    
    $('a.close', this.view).bind('click', {instance: this}, this.onClose);
    $('a.save', this.view).bind('click', {instance: this}, this.onSave);
  },
  
  reset: function() {
    $(':input', this.view)
      .not(':button, :submit, :reset')
      .val(null)
      .removeAttr('checked')
      .removeAttr('selected');
    $('input#contacted', this.view).attr('checked', false);
    $('input#active', this.view).attr('checked', true);
    
    now = new Date();
    started_year = now.getFullYear();
    started_month = now.getMonth() + 1;
    started_day = now.getDate();
    started_hour = now.getHours();
    started_minute = now.getMinutes();
    started_second = now.getSeconds();
    finished_year = now.getFullYear();
    finished_month = now.getMonth() + 1;
    finished_day = now.getDate();
    finished_hour = now.getHours();
    finished_minute = now.getMinutes();
    finished_second = now.getSeconds();
    
    $('select#started_year').val(started_year);
    $('select#started_month').val(started_month);
    $('select#started_day').val(started_day);
    $('select#started_hour').val(this._padNumber(started_hour));
    $('select#started_minute').val(this._padNumber(started_minute));
    $('select#started_second').val(this._padNumber(started_second));
    $('select#finished_year').val(finished_year);
    $('select#finished_month').val(finished_month);
    $('select#finished_day').val(finished_day);
    $('select#finished_hour').val(this._padNumber(finished_hour));
    $('select#finished_minute').val(this._padNumber(finished_minute));
    $('select#finished_second').val(this._padNumber(finished_second));
  },
  
  setRepair: function(repair) {
    this.repair = repair;
    
    if(repair != null) {
      started = (new Date()).setISO8601(repair.started);
      finished = (new Date()).setISO8601(repair.finished);
      started_year = started.getFullYear();
      started_month = started.getMonth() + 1;
      started_day = started.getDate();
      started_hour = started.getHours();
      started_minute = started.getMinutes();
      started_second = started.getSeconds();
      finished_year = finished.getFullYear();
      finished_month = finished.getMonth() + 1;
      finished_day = finished.getDate();
      finished_hour = finished.getHours();
      finished_minute = finished.getMinutes();
      finished_second = finished.getSeconds();
      
      $('input#name', this.view).val(repair.name);
      $('input#phone', this.view).val(repair.phone);
      $('input#item', this.view).val(repair.item);
      $('input#serial', this.view).val(repair.serial);
      $('textarea#description', this.view).val(repair.description);
      $('textarea#symptoms', this.view).val(repair.symptoms);
      $('textarea#notes', this.view).val(repair.notes);
      $('input#warranty', this.view).val(repair.warranty);
      $('input#cost', this.view).val(Currency.format(repair.cost));
      $('input#receiver', this.view).val(repair.receiver);
      $('input#technician', this.view).val(repair.technician);
      $('input#status', this.view).val(repair.status);
      $('input#contacted', this.view).attr('checked', repair.contacted);
      $('input#active', this.view).attr('checked', repair.active);
      
      $('select#started_year').val(started_year);
      $('select#started_month').val(started_month);
      $('select#started_day').val(started_day);
      $('select#started_hour').val(this._padNumber(started_hour));
      $('select#started_minute').val(this._padNumber(started_minute));
      $('select#started_second').val(this._padNumber(started_second));
      $('select#finished_year').val(finished_year);
      $('select#finished_month').val(finished_month);
      $('select#finished_day').val(finished_day);
      $('select#finished_hour').val(this._padNumber(finished_hour));
      $('select#finished_minute').val(this._padNumber(finished_minute));
      $('select#finished_second').val(this._padNumber(finished_second));
    } else {
      this.reset();
    }
  },
  
  onClose: function(event) {
    event.data.instance.view.hide();
    event.preventDefault();
  },
  
  onSave: function(event) {
    started_year = $('select#started_year').val();
    started_month = $('select#started_month').val() - 1;
    started_day = $('select#started_day').val();
    started_hour = $('select#started_hour').val();
    started_minute = $('select#started_minute').val();
    started_second = $('select#started_second').val();
    finished_year = $('select#finished_year').val();
    finished_month = $('select#finished_month').val() - 1;
    finished_day = $('select#finished_day').val();
    finished_hour = $('select#finished_hour').val();
    finished_minute = $('select#finished_minute').val();
    finished_second = $('select#finished_second').val();
    
    started = new Date(started_year, started_month, started_day, started_hour, started_minute, started_second);
    finished = new Date(finished_year, finished_month, finished_day, finished_hour, finished_minute, finished_second);
    
    name = $('input#name', this.view).val();
    phone = $('input#phone', this.view).val();
    item = $('input#item', this.view).val();
    serial = $('input#serial', this.view).val();
    description = $('textarea#description', this.view).val();
    symptoms = $('textarea#symptoms', this.view).val();
    notes = $('textarea#notes', this.view).val();
    warranty = $('input#warranty', this.view).val();
    cost = parseInt(Currency.toPennies($('input#cost', this.view).val()));
    receiver = $('input#receiver', this.view).val();
    technician = $('input#technician', this.view).val();
    status = $('input#status', this.view).val();
    contacted = $('input#contacted', this.view).attr('checked');
    active = $('input#active', this.view).attr('checked');
    
    if(event.data.instance.repair == null) {
      repair = Repair.create({
        name: name,
        phone: phone,
        item: item,
        serial: serial,
        description: description,
        symptoms: symptoms,
        notes: notes,
        warranty: warranty,
        cost: cost,
        receiver: receiver,
        technician: technician,
        started: started,
        finished: finished,
        contacted: contacted,
        active: active
      });
    } else {
      repair = Repair.find(event.data.instance.repair.id);
      repair.name = name;
      repair.phone = phone;
      repair.item = item;
      repair.serial = serial;
      repair.description = description;
      repair.symptoms = symptoms;
      repair.notes = notes;
      repair.warranty = warranty;
      repair.cost = cost;
      repair.receiver = receiver;
      repair.technician = technician;
      repair.started = started;
      repair.finished = finished;
      repair.contacted = contacted;
      repair.active = active;
      repair.save();
    }
    
    event.data.instance.setRepair(repair);
    event.data.instance.notifyObservers(event.data.instance.repair.name, 1);
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