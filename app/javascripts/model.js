var Model = new JS.Class({
  extend: {
    resource: undefined,
    columns: [],
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
    for(collection in this.klass.has_many) {
      this['_' + this.klass.has_many[collection]] = [];
      this['add' + this.klass.has_many[collection].singularize().capitalize()] = new Function(this.klass.has_many[collection].singularize(), 'return this._add_collection("' + this.klass.has_many[collection] + '", ' + this.klass.has_many[collection] + ');');
      this['set' + this.klass.has_many[collection].capitalize()] = new Function(this.klass.has_many[collection], 'return this._set_collection("' + this.klass.has_many[collection] + '", ' + this.klass.has_many[collection] + ');');
      this['delete' + this.klass.has_many[collection].singularize().capitalize()] = new Function(this.klass.has_many[collection].singularize(), 'return this._delete_collection("' + this.klass.has_many[collection] + '", ' + this.klass.has_many[collection] + ');');
      this['clear' + this.klass.has_many[collection].capitalize()] = new Function('return this._clear_collection("' + this.klass.has_many[collection] + '");');
      this['count' + this.klass.has_many[collection].capitalize()] = new Function('return this._count_collection("' + this.klass.has_many[collection] + '");');
      this['build' + this.klass.has_many[collection].singularize().capitalize()] = new Function('attributes', 'return this._build_collection("' + this.klass.has_many[collection] + '", attributes);');
      this['create' + this.klass.has_many[collection].singularize().capitalize()] = new Function('attributes', 'return this._create_collection("' + this.klass.has_many[collection] + '", attributes);');
      this[this.klass.has_many[collection]] = new Function('force_reload', 'return this._find_has_many("' + this.klass.has_many[collection] + '", force_reload);');
    }
  },
  
  // TODO: Create or update relations during save
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
      
      saved = false;
      this.klass._ajax(url, type, data, function(result) {
        klass.id = result[resource].id;
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
  
  // TODO: Move validation to module
  valid: function() {
    return true;
  },
  
  _set_association: function(associate, object) {
    if(associate + '_id' in this) {
      this[associate + '_id'] = object.id;
    } else {
      // Remove old asssociation
      object[this.klass.resource + '_id'] = this.id;
    }
    return this['_' + associate] = object;
  },
  
  _build_association: function(associate, attributes) {
    return this._set_association(associate, new window[associate.capitalize()](attributes));
  },
  
  _create_association: function(associate, attributes) {
    association = this._build_association(associate, attributes);
    association.save();
    return association;
  },
  
  _remove_association: function(associate, id) {
    association = window[associate.capitalize].find(id);
    association[associate + '_id'] = undefined;
    return association.save();
  },
  
  _add_collection: function(collection, object) {
    if(this.id != undefined && this.id != null) {
      if(collection + '_id' in object) {
        object[collection + '_id'] = this.id;
      }
    }
    this['_' + collection].push(object);
    //Save new record if this has id 
    return object;
  },
  
  _set_collection: function(collection, objects) {
    this._clear_collection(collection);
    this['_' + collection] = objects;
    return this['_' + collection];
    // Save new records if this has id
  },
  
  _merge_collection: function(collection, objects) {
    
  },
  
  _delete_collection: function(collection, object) {
    for(collective in this['_' + collection]) {
      if(this['_' + collection][collective].equals(object)) {
        this['_' + collection].splice(collection, 1);
      }
    }
    if(collection.singularize() + '_id' in object) {
      object[collection.singularize() + '_id'] = undefined;
      if(object.id != undefined && object.id != null) {
        object.save();
      }
    } else {
      // Has and belongs to many
    }
  },
  
  _clear_collection: function(collection) {
    for(record in this['_' + collection]) {
      if(this['_' + collection][record].id != null && this['_' + collection][record].id != undefined) {
        this['_' + collection][record]['_' + collection.singularize()] = undefined;
        if(collection.singularize() + '_id' in this['_' + collection][record]) {
          this['_' + collection][record][collection.singularize() + '_id'] = undefined;
        } else {
          // Has and belongs to many
        }
        this['_' + collection][record].save();
      }
    }
    this['_' + collection] = [];
  },
  
  _count_collection: function(collection) {
    return this._find_has_many(collection).length;
  },
  
  _build_collection: function(collection, attributes) {
    return this._add_collection(collection, new window[collection.capitalize()](attributes));
  },
  
  _create_collection: function(collection, attributes) {
    collective = this._build_collection(collection, attributes);
    collective.save();
    return collective;
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
      klass = this;
      url = '/api/' + resource.pluralize() + '/' + this.id + '/' + associate;
      this.klass._ajax(url, 'GET', null, function(result) {
        klass['_' + associate] = new window[associate.capitalize()](result[associate]);
      });
    }
    return this['_' + associate];
  },
  
  _find_has_many: function(collection, force_reload) {
    if(force_reload == undefined) {
      force_reload = false;
    }
    if(force_reload || this['_' + collection].length == 0) {
      resource = this.klass.resource;
      resources = [];
      url = '/api/' + resource.pluralize() + '/' + this.id + '/' + collection;
      this.klass._ajax(url, 'GET', null, function(results) {
        for(result in results) {
          resources.push(new window[collection.singularize().capitalize()](results[result][collection.singularize()]));
        }
      });
      if(this['_' + collection].length == 0) {
        return this._set_collection(collection, resources);
      } else {
        return this._merge_collection(collection, resources);
      }
    }
  }
});