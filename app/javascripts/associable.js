var Associable = new JS.Module({
  extend: {
    belongs_to: [],
    has_one: [],
    has_many: [],
  },
  
  _initialize_associations: function() {
    for(association in this.klass.belongs_to) {
      this['_' + this.klass.belongs_to[association]] = undefined;
      this['_' + this.klass.belongs_to[association] + '_loaded'] = false;
      this['set' + this.klass.belongs_to[association].capitalize()] = new Function(this.klass.belongs_to[association], 'return this._set_association("' + this.klass.belongs_to[association] + '", ' + this.klass.belongs_to[association] + ');');
      this['build' + this.klass.belongs_to[association].capitalize()] = new Function('attributes', 'return this._build_association("' + this.klass.belongs_to[association] + '", attributes);');
      this['create' + this.klass.belongs_to[association].capitalize()] = new Function('attributes', 'return this._create_association("' + this.klass.belongs_to[association] + '", attributes);');
      this[this.klass.belongs_to[association]] = new Function('force_reload', 'return this._find_belongs_to("' + this.klass.belongs_to[association] + '", force_reload);');
    }
    for(association in this.klass.has_one) {
      this['_' + this.klass.has_one[association]] = undefined;
      this['_' + this.klass.has_one[association] + '_loaded'] = false;
      this['set' + this.klass.has_one[association].capitalize()] = new Function(this.klass.has_one[association], 'return this._set_association("' + this.klass.has_one[association] + '", ' + this.klass.has_one[association] + ');');
      this['build' + this.klass.has_one[association].capitalize()] = new Function('attributes', 'return this._build_association("' + this.klass.has_one[association] + '", attributes);');
      this['create' + this.klass.has_one[association].capitalize()] = new Function('attributes', 'return this._create_association("' + this.klass.has_one[association] + '", attributes);');
      this[this.klass.has_one[association]] = new Function('force_reload', 'return this._find_has_one("' + this.klass.has_one[association] + '", force_reload);');
    }
    for(collection in this.klass.has_many) {
      this['_' + this.klass.has_many[collection]] = [];
      this['_' + this.klass.has_many[collection] + '_loaded'] = false;
      this['add' + this.klass.has_many[collection].singularize().capitalize()] = new Function(this.klass.has_many[collection].singularize(), 'return this._add_collection("' + this.klass.has_many[collection] + '", ' + this.klass.has_many[collection].singularize() + ');');
      this['set' + this.klass.has_many[collection].capitalize()] = new Function(this.klass.has_many[collection], 'return this._set_collection("' + this.klass.has_many[collection] + '", ' + this.klass.has_many[collection] + ');');
      this['delete' + this.klass.has_many[collection].singularize().capitalize()] = new Function(this.klass.has_many[collection].singularize(), 'return this._delete_collection("' + this.klass.has_many[collection] + '", ' + this.klass.has_many[collection].singularize() + ');');
      this['clear' + this.klass.has_many[collection].capitalize()] = new Function('return this._clear_collection("' + this.klass.has_many[collection] + '");');
      this['count' + this.klass.has_many[collection].capitalize()] = new Function('return this._count_collection("' + this.klass.has_many[collection] + '");');
      this['build' + this.klass.has_many[collection].singularize().capitalize()] = new Function('attributes', 'return this._build_collection("' + this.klass.has_many[collection] + '", attributes);');
      this['create' + this.klass.has_many[collection].singularize().capitalize()] = new Function('attributes', 'return this._create_collection("' + this.klass.has_many[collection] + '", attributes);');
      this[this.klass.has_many[collection]] = new Function('force_reload', 'return this._find_has_many("' + this.klass.has_many[collection] + '", force_reload);');
    }
  },
  
  _set_association: function(associate, object) {
    if(associate + '_id' in this) {
      if(object._has_id()) {
        this[associate + '_id'] = object.id;
      }
    } else {
      if(this['_' + associate]._has_id()) {
        this['_' + associate][this.klass.resource + '_id'] = undefined;
        this['_' + associate].save();
      }
      if(this._has_id()) {
        object[this.klass.resource + '_id'] = this.id;
        object.save();
      }
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
    if(this._has_id()) {
      if(this.klass.resource + '_id' in object) {
        object[this.klass.resource + '_id'] = this.id;
      }
    }
    return this._merge_collection(collection, [object]);
  },
  
  _set_collection: function(collection, objects) {
    this._clear_collection(collection);
    this['_' + collection] = objects;
    return this['_' + collection];
  },
  
  _merge_collection: function(collection, objects) {
    for(object in objects) {
      if(objects[object]._has_id()) {
        found = false;
        for(record in this['_' + collection]) {
          if(this['_' + collection][record]._has_id() && this['_' + collection][record].id == objects[object].id) {
            this['_' + collection][record] = objects[object];
            found = true;
          }
        }
        if(!found) {
          this['_' + collection].push(objects[object]);
        }
      } else {
        this['_' + collection].push(objects[object]);
      }
    }
    return this['_' + collection];
  },
  
  _delete_collection: function(collection, object) {
    this._find_has_many(collection);
    for(collective in this['_' + collection]) {
      if(this['_' + collection][collective].equals(object)) {
        this['_' + collection].splice(collective, 1);
      }
    }
    if(this.klass.resource + '_id' in object) {
      object[this.klass.resource + '_id'] = null;
      if(object.id != undefined && object.id != null) {
        object.save();
      }
    } else {
      // Has and belongs to many
    }
  },
  
  _clear_collection: function(collection) {
    for(record in this['_' + collection]) {
      if(this['_' + collection][record]._has_id()) {
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
    return this._add_collection(collection, new window[collection.singularize().capitalize()](attributes));
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
    if(!this['_' + associate + '_loaded']) {
      force_reload = true;
    }
    if(this._has_id() && force_reload) {
      if(this[associate + '_id'] != null && this[associate + '_id'] != undefined) {
        this['_' + associate] = window[associate.capitalize()].find(this[associate + '_id']);
        if(!this['_' + associate + '_loaded']) {
          this['_' + associate + '_loaded'] = true;
        }
      }
    }
    return this['_' + associate];
  },
  
  _find_has_one: function(associate, force_reload) {
    if(force_reload == undefined) {
      force_reload = false;
    }
    if(!this['_' + associate + '_loaded']) {
      force_reload = true;
    }
    if(this._has_id() && force_reload) {
      resource = this.klass.resource;
      klass = this;
      url = '/api/' + resource.pluralize() + '/' + this.id + '/' + associate;
      this.klass._ajax(url, 'GET', null, function(result) {
        klass['_' + associate] = new window[associate.capitalize()](result[associate]);
      });
      if(!this['_' + associate + '_loaded']) {
        this['_' + associate + '_loaded'] = true;
      }
    }
    return this['_' + associate];
  },
  
  _find_has_many: function(collection, force_reload) {
    if(force_reload == undefined) {
      force_reload = false;
    }
    if(!this['_' + collection + '_loaded']) {
      force_reload = true;
    }
    if(this._has_id() && force_reload) {
      resource = this.klass.resource;
      resources = [];
      url = '/api/' + resource.pluralize() + '/' + this.id + '/' + collection;
      this.klass._ajax(url, 'GET', null, function(results) {
        for(result in results) {
          resources.push(new window[collection.singularize().capitalize()](results[result][collection.singularize()]));
        }
      });
      if(!this['_' + collection + '_loaded']) {
        this['_' + collection + '_loaded'] = true;
      }
      return this._merge_collection(collection, resources);
    } else {
      if(this['_' + collection].length == 0) {
        return [];
      } else {
        return this['_' + collection];
      }
    }
  }
});