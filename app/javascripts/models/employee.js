//= require "../model"

var Employee = new JS.Class(Model, {
  extend: {
    resource: 'employee',
    columns: ['id', 'person_id', 'title', 'rate', 'active'],
    belongs_to: ['person'],
    has_many: ['timecards']
  },
  
  stamp: function() {
    url = '/api/employees/' + this.id + '/stamp';
    this.klass._ajax(url, 'POST', null, function(result) {
      return true;
    });
    return false;
  }
});