var Entry = new JS.Class({
  
  initialize: function() {
    this.id = null;
    this.title = null;
    this.description = null;
    this.time = new Date();
    this.amount = 0;
    this.action = 'debit';
  },
  
  valid: function() {
    return true;
  }
});