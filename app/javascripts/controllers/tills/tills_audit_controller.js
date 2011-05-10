//= require "../view_controller"

var TillsAuditController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.till = null;
    this.reset();
    
    $('a.tills_calculate', this.view).bind('click', {instance: this}, this.onCalculate);
    $('a.tills_close', this.view).bind('click', {instance: this}, this.onClose);
    $('a.tills_save', this.view).bind('click', {instance: this}, this.onSave);
  },
  
  reset: function() {
    $(':input', this.view)
      .not(':button, :submit, :reset')
      .val(null)
      .removeAttr('checked')
      .removeAttr('selected');
    $(':input', this.view).val(0);
    $('input#balance', this.view).val(null);
  },
  
  update: function(till) {
    this.till = till;
  },
  
  onCalculate: function(event) {
    pennies = $('input#pennies', event.data.instance.view).val();
    nickels = $('input#nickels', event.data.instance.view).val();
    dimes = $('input#dimes', event.data.instance.view).val();
    quarters = $('input#quarters', event.data.instance.view).val();
    ones = $('input#ones', event.data.instance.view).val();
    fives = $('input#fives', event.data.instance.view).val();
    tens = $('input#tens', event.data.instance.view).val();
    twenties = $('input#twenties', event.data.instance.view).val();
    fifties = $('input#fifties', event.data.instance.view).val();
    hundreds = $('input#hundreds', event.data.instance.view).val();
    penny_rolls = $('input#penny_rolls', event.data.instance.view).val();
    nickel_rolls = $('input#nickel_rolls', event.data.instance.view).val();
    dime_rolls = $('input#dime_rolls', event.data.instance.view).val();
    quarter_rolls = $('input#quarter_rolls', event.data.instance.view).val();
    total = (pennies * 0.01) + (nickels * 0.05) + (dimes * 0.1) + (quarters * 0.25) + (ones * 1) + (fives * 5) + (tens * 10) +
      (twenties * 20) + (fifties * 50) + (hundreds * 100) + (penny_rolls * 0.50) + (nickel_rolls * 2) + (dime_rolls * 5) + (quarter_rolls * 10);
    
    $('input#balance', event.data.instance.view).val(total);
    event.preventDefault();
  },
  
  onClose: function(event) {
    event.data.instance.view.hide();
    event.preventDefault();
  },
  
  onSave: function(event) {
    till_balance = event.data.instance.till.balance();
    new_balance = Currency.toPennies($('input#balance', event.data.instance.view).val());
    amount = new_balance - till_balance;

    Entry.create({
      till_id: event.data.instance.till.id,
      employee_id: parseInt($('ul#employee_nav li.current_employee_login').attr('data-employee-id')),
      title: 'Audit - ' + new Date(),
      description: '',
      amount: amount
    });
    
    event.data.instance.notifyObservers();
    event.data.instance.view.hide();
    event.preventDefault();
  }
});