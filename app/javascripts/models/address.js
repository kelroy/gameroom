var Address = new JS.Class({
  
  initialize: function() {
    this.id = null;
    this.first_line = null;
    this.second_line = null;
    this.city = null;
    this.state = null;
    this.province = null;
    this.country = null;
    this.zip = null
  },

  save: function() {
    
  },
  
  valid: function() {
    return true;
  }
});