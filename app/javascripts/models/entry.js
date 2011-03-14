var Entry = new JS.Class({
  
  initialize: function(params) {
    this.id = params.id;
    this.title = params.title;
    this.description = params.description;
    if(params.time != undefined) {
      this.time = new Date(params.time);
    } else {
      this.time = new Date();
    }
    this.amount = params.amount;
    this.action = params.action;
  },
  
  valid: function() {
    return true;
  }
});