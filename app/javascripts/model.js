var Model = new JS.Class({
  extend: {
    resource: undefined,
    belongs_to: [],
    has_one: [],
    has_many: [],
    
    build: function(params) {
      return new window[this.resource.capitalize()](params);
    },
    
    create: function(params) {
      klass = new window[this.resource.capitalize()](params);
      klass.save();
      return klass;
    },
    
    find: function(id) {
      resource = this.resource;
      klass = undefined;
      $.ajax({
        url: '/api/' + resource.pluralize() + '/' + id,
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          klass = new window[resource.capitalize()](results[resource]);
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
      return klass;
    },
    
    all: function() {
      resource = this.resource;
      resources = [];
      $.ajax({
        url: '/api/' + resource.pluralize(),
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          for(result in results) {
            resources.push(new window[resource.capitalize()](results[result][resource]));
          }
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
      return resources;
    },
    
    where: function(pattern, query, page, per_page) {
      resource = this.resource;
      resources = [];
      search = new Object();
      search[pattern] = query.split(" ");
      
      $.ajax({
        url: '/api/'+ resource.pluralize() + '/search',
        data: JSON.stringify({
          search: search,
          page: page,
          per_page: per_page
        }),
        dataType: 'json',
        accept: 'application/json',
        contentType: 'application/json',
        processData: false,
        type: 'POST',
        async: false,
        success: function(results) {
          for(result in results) {
            resources.push(new window[resource.capitalize()](results[result][resource]));
          }
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
      return resources;
    }
  },
  
  initialize: function(params) {
    for(param in params) {
      this[param] = params[param];
    }
    for(association in this.klass.belongs_to) {
      this[this.klass.belongs_to[association]] = new Function('return this._find_parent("' + this.klass.belongs_to[association] + '");');
    }
    for(association in this.klass.has_one) {
      this[this.klass.has_one[association]] = new Function('return this._find_one("' + this.klass.has_one[association] + '");');
    }
    for(association in this.klass.has_many) {
      this[this.klass.has_many[association]] = new Function('return this._find_many("' + this.klass.has_many[association] + '");');
    }
  },
  
  _find_one: function(association) {
    resource = this.klass.resource;
    klass = undefined;
    $.ajax({
      url: '/api/' + resource.pluralize() + '/' + this.id + '/' + association,
      accept: 'application/json',
      dataType: 'json',
      async: false,
      success: function(results) {
        klass = new window[association.capitalize()](results[association]);
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
    return klass;
  },
  
  _find_many: function(association) {
    resource = this.klass.resource;
    resources = [];
    klass = undefined;
    $.ajax({
      url: '/api/' + resource.pluralize() + '/' + this.id + '/' + association,
      accept: 'application/json',
      dataType: 'json',
      async: false,
      success: function(results) {
        for(result in results) {
          resources.push(new window[association.singularize().capitalize()](results[result][association.singularize()]));
        }
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
    return resources;
  },
  
  _find_parent: function(parent) {
    if(this[parent + '_id'] != null && this[parent + '_id'] != undefined) {
      return window[parent.capitalize()].find(this[parent + '_id']);
    } else {
      return undefined;
    }
  },
  
  save: function() {
    if(this.valid()) {
      resource = this.klass.resource;
      
      if(this.id == undefined || this.id == 0) {
        url = '/api/' + resource.pluralize();
        type = 'POST';
      } else {
        url = '/api/' + resource.pluralize() + '/' + this.id;
        type = 'PUT';
      }
      
      data = new Object();
      data[resource] = this;
      
      $.ajax({
        url: url,
        accept: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        processData: false,
        type: type,
        async: false,
        success: function(result) {
          this.id = result[resource].id;
          saved = true;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error Status: ' + XMLHttpRequest.status);
          console.error('Error Text: ' + textStatus);
          console.error('Error Thrown: ' + errorThrown);
          console.log(XMLHttpRequest);
          saved = false;
        },
        username: 'x',
        password: 'x'
        
      });
      
      return saved;
    } else {
      return false;
    }
  },
  
  valid: function() {
    return true;
  }
});