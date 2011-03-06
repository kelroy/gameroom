var Payment = new JS.Class({
  
  initialize: function() {
    this.type = 'cash';
    this.amount = 0;
  },
  
  valid: function() {
    return true;
  }
});