var Payment = new JS.Class({
  
  initialize: function(form, amount) {
    this.id = null;
    this.form = form;
    this.amount = amount;
  },
  
  valid: function() {
    return true;
  }
});