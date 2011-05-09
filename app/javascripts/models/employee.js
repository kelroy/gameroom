//= require "../model"

var Employee = new JS.Class(Model, {
  extend: {
    resource: 'employee',
    columns: ['id', 'person_id', 'title', 'token', 'password', 'password_confirmation', 'rate', 'administrator', 'active'],
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
    },
    
    authenticate: function(username, password) {
      resource = this.resource;
      klass = null;
      data = {
        token: username,
        password: password
      };
      url = '/api/' + this.resource.pluralize() + '/authenticate';
      this._ajax(url, 'POST', data, function(result) {
        if(result[resource] != null) {
          klass = new window[resource.capitalize()](result[resource]);
        }
      });
      return klass;
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