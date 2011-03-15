var Email = new JS.Class({
  
  initialize: function(params) {
    this.id = params.id;
    this.address = params.address;
  },

  save: function() {
    
  },
  
  valid: function() {
    if(this.address == '' || this.address == undefined || this.address == null) {
      return false;
    }
    return true;
  }
});