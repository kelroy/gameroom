var Payment = new JS.Class({
  
  initialize: function(params) {
    this.id = params.id;
    this.form = params.form;
    this.amount = params.amount;
  },
  
  valid: function() {
    return true;
  }
});