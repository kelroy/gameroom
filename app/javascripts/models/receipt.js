var Receipt = new JS.Class({
  
  initialize: function(params) {
    this.quantity = params.quantity;
  },
  
  valid: function() {
    return true;
  }
});