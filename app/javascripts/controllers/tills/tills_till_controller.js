//= require "../view_controller"

var TillsTillController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.till = null;
    
    $('a.tills_close', this.view).bind('click', {instance: this}, this.onClose);
    $('a.tills_save', this.view).bind('click', {instance: this}, this.onSave);
  },
  
  reset: function() {
    $(':input', this.view)
      .not(':button, :submit, :reset')
      .val(null)
      .removeAttr('checked')
      .removeAttr('selected');
    $('input#active', this.view).attr('checked', true);
  },
  
  update: function(till) {
    this.till = till;
    
    if(till != null) {
      $('input#title', this.view).val(till.title);
      $('textarea#description', this.view).val(till.description);
      $('input#active', this.view).attr('checked', till.active);
    } else {
      this.reset();
    }
  },
  
  onClose: function(event) {
    event.data.instance.view.hide();
    event.preventDefault();
  },
  
  onSave: function(event) {
    title = $('input#title', event.data.instance.view).val();
    description = $('textarea#description', event.data.instance.view).val();
    active = $('input#active', event.data.instance.view).attr('checked');
    
    if(event.data.instance.till != null) {
      till = event.data.instance.till;
      till.title = title;
      till.description = description;
      till.active = active;
      till.save();
    } else {
      Till.create({
        title: title,
        description: description,
        minimum_transfer: 0,
        minimum_balance: 0,
        active: active
      });
    }
    
    event.data.instance.notifyObservers();
    event.data.instance.view.hide();
    event.preventDefault();
  }
});