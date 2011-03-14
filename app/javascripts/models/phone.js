var Phone = new JS.Class({
  
  initialize: function(params) {
    this.id = params.id;
    this.title = params.title;
    this.number = params.number;
  },

  save: function() {
    
  },
  
  valid: function() {
    return true;
  }
});