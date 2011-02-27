var Transaction = new JS.Class({
  
  initialize: function() {
    this.till = new Till();
    this.customer = new Customer();
    this.receipt = new Receipt();
    this.items = [];
    this.tax_rate = 0.07;
    this.complete = false;
    this.locked = false;
  },

  save: function() {
    
  }
});