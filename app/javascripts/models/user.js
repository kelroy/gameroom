//= require "../model"

var User = new JS.Class(Model, {
  extend: {
    resource: 'user',
    columns: ['id', 'person_id', 'login', 'pin', 'email', 'password', 'password_confirmation', 'administrator', 'active'],
    belongs_to: ['person'],
    has_many: ['tills', 'timecards'],
    
    _in: function() {
      resource = this.resource;
      resources = [];
      url = '/api/' + this.resource.pluralize() + '/in';
      this._ajax(url, 'GET', null, function(results) {
        for(result in results) {
          resources.push(new window[resource.capitalize()](results[result][resource]));
        }
      });
      return resources;
    },

    _out: function() {
      resource = this.resource;
      resources = [];
      url = '/api/' + this.resource.pluralize() + '/out';
      this._ajax(url, 'GET', null, function(results) {
        for(result in results) {
          resources.push(new window[resource.capitalize()](results[result][resource]));
        }
      });
      return resources;
    }
  },
  
  stamp: function() {
    resource = this.klass.resource;
    klass = undefined;
    url = '/api/' + this.klass.resource.pluralize() + '/' + this.id + '/stamp';
    this.klass._ajax(url, 'POST', null, function(result) {
      klass = new window[resource.capitalize()](result[resource]);
    });
    return klass;
  }
});