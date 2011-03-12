var Address = new JS.Class({
  
  initialize: function(params) {
    this.id = params.id;
    this.first_line = params.first_line;
    this.second_line = params.second_line;
    this.city = params.city;
    this.state = params.state;
    this.province = params.province;
    this.country = params.country;
    this.zip = params.zip;
  },

  save: function() {
    
  },
  
  valid: function() {
    return true;
  }
});