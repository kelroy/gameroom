//= require "../model"

var User = new JS.Class(Model, {
  extend: {
    resource: 'user',
    columns: ['id', 'person_id', 'login', 'pin', 'email', 'password', 'password_confirmation', 'administrator', 'active'],
    belongs_to: ['person'],
    has_many: ['tills', 'timecards']
  },
  
  stamp: function() {
    url = '/api/users/' + this.id + '/stamp';
    this.klass._ajax(url, 'POST', null, function(result) {
      return true;
    });
    return false;
  }
});