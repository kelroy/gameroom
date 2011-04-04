//= require "association"
//= require "validation"

var Model = new JS.Class({
  include: [Association, Validation],
  
  extend: {
    resource: undefined,
    columns: [],
    
    build: function(attributes) {
      return new window[this.resource.capitalize()](attributes);
    },
    
    create: function(attributes) {
      klass = this.build(attributes);
      klass.save();
      return klass;
    },
    
    destroy: function(id) {
      resource = this.resource;
      klass = undefined;
      url = '/api/' + resource.pluralize() + '/' + id;
      this._ajax(url, 'DELETE', null, function(result) {
        klass = new window[resource.capitalize()](result[resource]);
        klass.id = null;
      });
      return klass;
    },
    
    find: function(id) {
      resource = this.resource;
      klass = undefined;
      url = '/api/' + resource.pluralize() + '/' + id;
      this._ajax(url, 'GET', null, function(result) {
        klass = new window[resource.capitalize()](result[resource]);
      });
      return klass;
    },
    
    all: function() {
      resource = this.resource;
      resources = [];
      url = '/api/' + resource.pluralize();
      this._ajax(url, 'GET', null, function(results) {
        for(result in results) {
          resources.push(new window[resource.capitalize()](results[result][resource]));
        }
      });
      return resources;
    },
    
    where: function(pattern, query, page, per_page) {
      resource = this.resource;
      resources = [];
      search = new Object();
      search[pattern] = query.split(" ");
      url = '/api/'+ resource.pluralize() + '/search';
      data = {
        search: search,
        page: page,
        per_page: per_page
      };
      this._ajax(url, 'POST', data, function(results) {
        for(result in results) {
          resources.push(new window[resource.capitalize()](results[result][resource]));
        }
      });
      return resources;
    },
    
    _ajax: function(url, type, data, callback) {
      if(data != null && data != undefined) {
        data = JSON.stringify(data);
      } else {
        data = undefined;
      }
      $.ajax({
        url: url,
        data: data,
        type: type,
        accept: 'application/json',
        contentType: 'application/json',
        dataType: 'json',
        processData: false,
        async: false,
        success: function(result) {
          callback(result);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error Status: ' + XMLHttpRequest.status);
          console.error('Error Text: ' + textStatus);
          console.error('Error Thrown: ' + errorThrown);
          console.log(XMLHttpRequest);
        },
        username: 'x',
        password: 'x'
      });
    }
  },
  
  initialize: function(attributes) {
    for(column in this.klass.columns) {
      this[this.klass.columns[column]] = undefined;
    }
    for(attribute in attributes) {
      this[attribute] = attributes[attribute];
    }
    this._initialize_associations();
  },
  
  save: function() {
    if(this.valid()) {
      instance = this;
      resource = this.klass.resource;
      
      if(this._has_id()) {
        url = '/api/' + resource.pluralize() + '/' + this.id;
        type = 'PUT';
      } else {
        url = '/api/' + resource.pluralize();
        type = 'POST';
      }
      
      data = {};
      data[resource] = {};
      for(column in this.klass.columns) {
        data[resource][this.klass.columns[column]] = this[this.klass.columns[column]];
      }
      
      saved = false;
      this.klass._ajax(url, type, data, function(result) {
        instance.id = result[resource].id;
        saved = true;
      });
      
      return saved;
    } else {
      return false;
    }
  },
  
  destroy: function() {
    return this.klass.destroy(this.id);
  },
  
  equals: function(object) {
    if(this.callSuper()) {
      return true;
    } else {
      if(this._has_id() && this.id == object.id) {
        return true;
      } else {
        for(column in this.klass.columns) {
          if(this[this.klass.columns[column]] != object[this.klass.columns[column]]) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  },
  
  _has_id: function() {
    return this.id != undefined && this.id != null;
  }
});