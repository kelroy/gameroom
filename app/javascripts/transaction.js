var Transaction = new JS.Class({
  include: JS.Observable,
  
  initialize: function() {
    this.till = new Till();
    this.customer = new Customer();
    this.receipt = new Receipt();
    this.items = [];
    this.total = 0;
    this.tax_rate = 0.07;
    this.complete = false;
    this.locked = false;
  },
  
  updated: function() {
    this.notifyObservers(this);
  },

  save: function() {
    
  }
});