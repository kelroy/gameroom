//= require "../view_controller"

var TillsAdjustController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.till = null;
    
    $('a.tills_close', this.view).bind('click', {instance: this}, this.onClose);
    $('a.tills_save', this.view).bind('click', {instance: this}, this.onSave);
  },
  
  reset: function() {
    this.update(null);
  },
  
  update: function(till) {
    this.till = till;
  },
  
  onClose: function(event) {
    event.data.instance.view.hide();
    event.preventDefault();
  },
  
  onSave: function(event) {
    amount = Currency.toPennies($('input#amount', event.data.instance.view).val());
    
    if(amount != 0) {
      Entry.create({
        till_id: event.data.instance.till.id,
        user_id: parseInt($('ul#user_nav li.current_user_login').attr('data-user-id')),
        title: 'Adjustment - ' + new Date(),
        description: $('textarea#description', event.data.instance.view).val(),
        amount: amount
      });

      event.data.instance.notifyObservers();
      event.data.instance.view.hide();
    }
    event.preventDefault();
  }
});