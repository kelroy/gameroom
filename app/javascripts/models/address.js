//= require "../model"
//= require "person"

var Address = new JS.Class(Model, {
  extend: {
    resource: 'address',
    columns: ['id', 'person_id', 'first_line', 'second_line', 'city', 'state', 'country', 'zip'],
    belongs_to: ['person']
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