var Address = new JS.Class({
  
  initialize: function(params) {
    this.id = params.id;
    this.first_line = params.first_line;
    this.second_line = params.second_line;
    this.city = params.city;
    this.state = params.state;
    this.country = params.country;
    this.zip = params.zip;
  },
  
  valid: function() {
    if(this.first_line == '' || this.first_line == undefined || this.first_line == null) {
      return false;
    }
    if(this.city == '' || this.city == undefined || this.city == null) {
      return false;
    }
    if(this.state == '' || this.state == undefined || this.state == null) {
      return false;
    }
    if(this.zip == '' || this.zip == undefined || this.zip == null) {
      return false;
    }
    return true;
  }
});