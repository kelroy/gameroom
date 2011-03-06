var Payment = new JS.Class({
  
  initialize: function() {
    this.id = null;
    this.type = 'cash';
    this.amount = 0;
  },
  
  valid: function() {
    return true;
  }
});