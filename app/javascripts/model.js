var Model = new JS.Class({
  extend: {
    resource: undefined,
    
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
  
  _find_child: function(child) {
    resource = this.klass.resource;
    klass = undefined;
    $.ajax({
      url: '/api/' + resource.pluralize() + '/' + this.id + '/' + child,
      accept: 'application/json',
      dataType: 'json',
      async: false,
      success: function(results) {
        klass = new window[child.capitalize()](results[child]);
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
  
  _find_children: function(child) {
    resource = this.klass.resource;
    resources = [];
    klass = undefined;
    $.ajax({
      url: '/api/' + resource.pluralize() + '/' + this.id + '/' + child.pluralize(),
      accept: 'application/json',
      dataType: 'json',
      async: false,
      success: function(results) {
        for(result in results) {
          resources.push(new window[child.capitalize()](results[result][child]));
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
      if(this.id == undefined || this.id == 0) {
        url = '/api/' + resource.pluralize();
        type = 'POST';
      } else {
        url = '/api/' + resource.pluralize() + '/' + this.id;
        type = 'PUT';
      }
      
      resource = this.klass.resource;
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