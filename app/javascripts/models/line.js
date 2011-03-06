var Line = new JS.Class({
  
  initialize: function() {
    this.id = null;
    this.transaction = null;
    this.item = null;
    this.quantity = 0;
    this.price = 0;
  },
  
  valid: function() {
    return true;
  }
});