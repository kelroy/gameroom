var Model = new JS.Class({
  extend: {
    resource: undefined,
    belongs_to: [],
    has_one: [],
    has_many: [],
    
    build: function(attributes) {
      return new window[this.resource.capitalize()](attributes);
    },
    
    create: function(attributes) {
      klass = new window[this.resource.capitalize()](attributes);
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
  
  initialize: function(attributes) {
    for(attribute in attributes) {
      this[attribute] = attributes[attribute];
    }
    for(association in this.klass.belongs_to) {
      this['_' + this.klass.belongs_to[association]] = undefined;
      this['set' + this.klass.belongs_to[association].capitalize()] = new Function(this.klass.belongs_to[association], 'return this._set_association("' + this.klass.belongs_to[association] + '", ' + this.klass.belongs_to[association] + ');');
      this['build' + this.klass.belongs_to[association].capitalize()] = new Function('attributes', 'return this._build_association("' + this.klass.belongs_to[association] + '", attributes);');
      this['create' + this.klass.belongs_to[association].capitalize()] = new Function('attributes', 'return this._create_association("' + this.klass.belongs_to[association] + '", attributes);');
      this[this.klass.belongs_to[association]] = new Function('force_reload', 'return this._find_belongs_to("' + this.klass.belongs_to[association] + '", force_reload);');
    }
    for(association in this.klass.has_one) {
      this['_' + this.klass.has_one[association]] = undefined;
      this['set' + this.klass.has_one[association].capitalize()] = new Function(this.klass.has_one[association], 'return this._set_association("' + this.klass.has_one[association] + '", ' + this.klass.has_one[association] + ');');
      this['build' + this.klass.has_one[association].capitalize()] = new Function('attributes', 'return this._build_association("' + this.klass.has_one[association] + '", attributes);');
      this['create' + this.klass.has_one[association].capitalize()] = new Function('attributes', 'return this._create_association("' + this.klass.has_one[association] + '", attributes);');
      this[this.klass.has_one[association]] = new Function('force_reload', 'return this._find_has_one("' + this.klass.has_one[association] + '", force_reload);');
    }
    for(association in this.klass.has_many) {
      this['_' + this.klass.has_many[association]] = [];
      this[this.klass.has_many[association]] = new Function('force_reload', 'return this._find_has_many("' + this.klass.has_many[association] + '", force_reload);');
    }
  },
  
  _set_association: function(associate, object) {
    return this['_' + associate] = object;
  },
  
  _build_association: function(associate, attributes) {
    return this._set_association(associate, new window[associate.capitalize()](attributes));
  },
  
  _create_association: function(associate, attributes) {
    association = this._build_association(associate, attributes);
    association.save();
    this._set_association(associate, association);
    for(belongs in this.klass.belongs_to) {
      if(this.klass.belongs_to[belongs] == associate) {
        this[associate + '_id'] = association.id;
      }
    }
    return association;
  },
  
  _find_belongs_to: function(associate, force_reload) {
    if(force_reload == undefined) {
      force_reload = false;
    }
    if(force_reload || this['_' + associate] == null || this['_' + associate] == undefined) {
      if(this[associate + '_id'] != null && this[associate + '_id'] != undefined) {
        this['_' + associate] = window[associate.capitalize()].find(this[associate + '_id']);
      }
    }
    return this['_' + associate];
  },
  
  _find_has_one: function(associate, force_reload) {
    if(force_reload == undefined) {
      force_reload = false;
    }
    if(force_reload || this['_' + associate] == null || this['_' + associate] == undefined) {
      resource = this.klass.resource;
      klass = undefined;
      $.ajax({
        url: '/api/' + resource.pluralize() + '/' + this.id + '/' + association,
        accept: 'application/json',
        dataType: 'json',
        async: false,
        success: function(results) {
          klass = new window[associate.capitalize()](results[associate]);
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
    } else {
      return this['_' + associate];
    }
  },
  
  _find_has_many: function(association, force_reload) {
    if(force_reload == undefined) {
      force_reload = false;
    }
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
  
  save: function() {
    if(this.valid()) {
      klass = this;
      resource = this.klass.resource;
      
      if(this.id == undefined || this.id == 0) {
        url = '/api/' + resource.pluralize();
        type = 'POST';
      } else {
        url = '/api/' + resource.pluralize() + '/' + this.id;
        type = 'PUT';
      }
      
      data = {};
      data[resource] = {};
      for(column in this.klass.columns) {
        data[resource][this.klass.columns[column]] = this[this.klass.columns[column]];
      }
      
      // Fix needs different ajax params for PUT and 200 OK return
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
          klass.id = result[resource].id;
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