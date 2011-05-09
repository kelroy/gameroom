//= require "view_controller"

var FormController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    
    $('a.clear', this.view).bind('click', {instance: this}, this.onClear);
    $('a.save', this.view).bind('click', {instance: this}, this.onSave);
  },
  
  reset: function() {
    $(':input', this.view)
      .not(':button, :submit, :reset')
      .val(null)
      .removeAttr('checked')
      .removeAttr('selected');
  },
  
  update: function(data) {
    // Overridden by subclass
  },
  
  save: function() {
    // Overridden by subclass
  },
  
  onClear: function(event) {
    event.data.instance.reset();
    event.preventDefault();
  },
  
  onSave: function(event) {
    event.data.instance.save();
    event.preventDefault();
  }
});