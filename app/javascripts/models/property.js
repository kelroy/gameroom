var Property = new JS.Class({
  
  initialize: function(params) {
    this.id = params.id;
    this.key = params.key;
    this.value = params.value;
  },
  
  valid: function() {
    return true;
  }
});