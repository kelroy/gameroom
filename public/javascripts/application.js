/* Gameroom */
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
    }
  },

  _clear_collection: function(collection) {
    for(record in this['_' + collection]) {
      if(this['_' + collection][record]._has_id()) {
        this['_' + collection][record]['_' + collection.singularize()] = undefined;
        if(collection.singularize() + '_id' in this['_' + collection][record]) {
          this['_' + collection][record][collection.singularize() + '_id'] = undefined;
        } else {
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
var Validatable = new JS.Module({
  _errors: [],

  valid: function() {
    this._errors = [];
    if(this.klass.validations != undefined) {
      for(column in this.klass.validations) {
        for(validation in this.klass.validations[column]) {
          if(this['_' + validation] != undefined) {
            this['_' + validation](column, this.klass.validations[column]);
          }
        }
      }
    }
    if(this._errors.length == 0) {
      return true;
    } else {
      return false;
    }
  },

  errors: function() {
    return this._errors;
  },

  _presence_of: function(column, options) {
    if(this[column] != null && this[column] != undefined && this[column] != '') {
      return true;
    } else {
      this._errors.push({
        column: column,
        type: 'presence_of',
        message: column + ' must not be empty.'
      });
      return false;
    }
  }
});

var Model = new JS.Class({
  include: [Associable, Validatable],

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

    where: function(statement, params, page, per_page, before, after) {
      resource = this.resource;
      resources = [];
      url = '/api/'+ resource.pluralize() + '/where';
      data = {
        statement: statement,
        params: params,
        page: page,
        per_page: per_page
      };
      this._ajax(url, 'POST', data, function(results) {
        for(result in results) {
          resources.push(new window[resource.capitalize()](results[result][resource]));
        }
      }, before, after);
      return resources;
    },

    search: function(pattern, query, page, per_page, before, after) {
      resource = this.resource;
      resources = [];
      search = new Object();
      search[pattern] = query;
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
      }, before, after);
      return resources;
    },

    _ajax: function(url, type, data, callback, before, after) {
      if(data != null && data != undefined) {
        data = JSON.stringify(data);
      } else {
        data = undefined;
      }
      if(before != null && before != undefined) {
        before();
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
          if(after != null && after != undefined) {
            setTimeout(after, 100);
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

var User = new JS.Class(Model, {
  extend: {
    resource: 'user',
    columns: ['id', 'person_id', 'login', 'pin', 'email', 'password', 'password_confirmation', 'administrator', 'active'],
    belongs_to: ['person'],
    has_many: ['tills']
  }
});

var Customer = new JS.Class(Model, {
  extend: {
    resource: 'customer',
    columns: ['id', 'person_id', 'credit', 'drivers_license_number', 'drivers_license_state', 'notes', 'active'],
    belongs_to: ['person'],
    has_many: ['transactions']
  }
});

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

var Phone = new JS.Class(Model, {
  extend: {
    resource: 'phone',
    columns: ['id', 'person_id', 'title', 'number'],
    belongs_to: ['person'],
    'number': {
      'presence_of': {}
    }
  }
});

var Email = new JS.Class(Model, {
  extend: {
    resource: 'email',
    columns: ['id', 'person_id', 'address'],
    belongs_to: ['person'],
    validations: {
      'address': {
        'presence_of': {}
      }
    },
  }
});

var Person = new JS.Class(Model, {
  extend: {
    resource: 'person',
    columns: ['id', 'first_name', 'middle_name', 'last_name', 'date_of_birth'],
    has_one: ['customer', 'employee', 'user'],
    has_many: ['addresses', 'emails', 'phones']
  }
});

var Address = new JS.Class(Model, {
  extend: {
    resource: 'address',
    columns: ['id', 'person_id', 'first_line', 'second_line', 'city', 'state', 'country', 'zip'],
    belongs_to: ['person'],
    validations: {
      'first_line': {
        'presence_of': {}
      },
      'city': {
        'presence_of': {}
      },
      'state': {
        'presence_of': {}
      },
      'zip': {
        'presence_of': {}
      }
    }
  }
});

var Entry = new JS.Class(Model, {
  extend: {
    resource: 'entry',
    columns: ['id', 'till_id', 'title', 'description', 'time', 'amount'],
    belongs_to: ['till']
  }
});

var Property = new JS.Class(Model, {
  extend: {
    resource: 'property',
    columns: ['id', 'key', 'value'],
  }
});

var Line = new JS.Class(Model, {
  extend: {
    resource: 'line',
    columns: ['id', 'transaction_id', 'item_id', 'title', 'description', 'quantity', 'condition', 'discount', 'price', 'credit', 'cash', 'purchase', 'taxable', 'discountable'],
    belongs_to: ['item', 'transaction'],
    'title': {
      'presence_of': {}
    }
  },

  subtotal: function() {
    if(this.purchase) {
      return Math.round(this.quantity * this.discount * this.price);
    } else {
      return Math.round(this.quantity * this.condition * this.credit * -1);
    }
  },

  creditSubtotal: function() {
    if(!this.purchase) {
      return parseInt(Math.round(this.quantity * this.credit * this.condition * -1));
    } else {
      return 0;
    }
  },

  cashSubtotal: function() {
    if(!this.purchase) {
      return parseInt(Math.round(this.quantity * this.cash * this.condition * -1));
    } else {
      return 0;
    }
  }
});

var Item = new JS.Class(Model, {
  extend: {
    resource: 'item',
    columns: ['id', 'title', 'description', 'sku', 'price', 'credit', 'cash', 'taxable', 'discountable', 'locked', 'active'],
    has_many: ['properties'],
    validations: {
      'title': {
        'presence_of': {}
      },
      'sku': {
        'presence_of': {}
      }
    },
  }
});

var Payment = new JS.Class(Model, {
  extend: {
    resource: 'payment',
    columns: ['id', 'transaction_id', 'form', 'amount'],
    belongs_to: ['transaction']
  }
});

var Till = new JS.Class(Model, {
  extend: {
    resource: 'till',
    columns: ['id', 'title', 'description', 'minimum_transfer', 'minimum_balance', 'retainable', 'active'],
    has_many: ['entries', 'transactions', 'users']
  }
});

var Timecard = new JS.Class(Model, {
  extend: {
    resource: 'timecard',
    columns: ['id', 'employee_id', 'begin', 'end'],
    belongs_to: ['employee']
  }
});

var Transaction = new JS.Class(Model, {
  extend: {
    resource: 'transaction',
    columns: ['id', 'till_id', 'customer_id', 'user_id', 'tax_rate', 'complete', 'locked'],
    belongs_to: ['customer', 'till', 'user'],
    has_many: ['lines', 'payments']
  },

  subtotal: function() {
    lines = this.lines();
    subtotal = 0;
    for(line in lines) {
      subtotal += lines[line].subtotal();
    }
    return parseInt(subtotal);
  },

  total: function() {
    return parseInt(this.purchaseSubtotal() + this.tax());
  },

  tax: function() {
    lines = this.lines();
    if(this.subtotal() > 0) {
      purchase_subtotal = this.purchaseSubtotal();
      taxable_subtotal = 0;
      for(line in lines) {
        if(lines[line].taxable && lines[line].subtotal() > 0) {
          taxable_subtotal += lines[line].subtotal();
        }
      }
      if(taxable_subtotal < purchase_subtotal) {
        return parseInt(Math.round(taxable_subtotal * this.tax_rate));
      } else {
        return parseInt(Math.round(purchase_subtotal * this.tax_rate));
      }
    } else {
      return 0;
    }
  },

  ratio: function() {
    ratio = 1.0 / Math.abs(this.creditSubtotal() / this.cashSubtotal());
    if(isNaN(ratio)) {
      return 0;
    } else {
      return ratio;
    }
  },

  finishable: function() {
    if(this.valid()) {
      subtotal = this.subtotal();
      amount_due = this.amountDue();
      if(subtotal > 0 && amount_due <= 0) {
        return true;
      } else if(subtotal < 0) {
        customer = this.customer();
        if(customer != undefined) {
          if(customer.valid()) {
            return true;
          }
        }
      } else if(this.countItems() > 0 && amount_due <= 0) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  },

  purchaseSubtotal: function() {
    payments = this.payments();
    subtotal = this.subtotal();
    if(subtotal >= 0) {
      store_credit_payment = 0;
      for(payment in payments) {
        if(payments[payment].form == 'store_credit') {
          store_credit_payment += parseInt(payments[payment].amount);
        }
      }
      return subtotal - store_credit_payment;
    } else {
      return subtotal;
    }
  },

  amountDue: function() {
    payments = this.payments();

    if(this.subtotal() >= 0) {
      payment_total = 0;
      for(payment in payments) {
        if(payments[payment].form != 'store_credit') {
          payment_total += parseInt(payments[payment].amount);
        }
      }
      return this.total() - payment_total;
    } else {
      cash_payment = 0;
      for(payment in payments) {
        if(payments[payment].form == 'cash') {
          cash_payment += payments[payment].amount;
        }
      }
      return cash_payment;
    }
  },

  countItems: function() {
    lines = this.lines();
    count = 0;
    for(line in lines) {
      count += lines[line].quantity;
    }
    return count;
  },

  creditSubtotal: function() {
    lines = this.lines();
    subtotal = 0;
    for(line in lines) {
      subtotal += lines[line].creditSubtotal();
    }
    return Math.abs(subtotal);
  },

  cashSubtotal: function() {
    lines = this.lines();
    subtotal = 0;
    for(line in lines) {
      subtotal += lines[line].cashSubtotal();
    }
    return Math.abs(subtotal);
  },

  updateCreditPayout: function(payment) {
    subtotal = this.subtotal();
    if(subtotal < 0) {
      this.updatePayoutRatio(payment.amount / subtotal);
    }
  },

  updateCashPayout: function(payment) {
    subtotal = this.subtotal();
    if(subtotal < 0) {
      credit_cash_ratio = this.ratio();
      cash_payout = parseInt(Math.round((credit_cash_ratio - (credit_cash_ratio * 0)) * subtotal));
      this.updatePayoutRatio(1 - (payment.amount / cash_payout));
    }
  },

  updatePayoutRatio: function(ratio) {
    if(ratio < 0 || ratio > 1) {
      ratio = 1;
    }
    credit_cash_ratio = this.ratio();
    subtotal = this.subtotal();
    credit_payout = parseInt(subtotal * ratio);
    cash_payout = parseInt((credit_cash_ratio - (credit_cash_ratio * ratio)) * subtotal);
    this.updatePayment(new Payment({form: 'store_credit', amount: credit_payout}));
    this.updatePayment(new Payment({form: 'cash', amount: cash_payout}));
  },

  updatePayment: function(updated_payment) {
    payments = this.payments();
    found = false;
    for(payment in payments) {
      if(payments[payment].form == updated_payment.form) {
        payments[payment] = updated_payment;
        found = true;
      }
    }
    if(!found) {
      this.addPayment(updated_payment);
    }
  }
});
var Factory = new JS.Class({
  extend: {
    factories: [],

    build: function(klass, properties) {
      var factory = this._factory_fetch(klass);
      if(factory != null && window[klass] != undefined) {
        var properties = this._merge_properties(factory.properties, properties);
        for(property in properties) {
          if(properties[property].sequence != undefined) {
            properties[property] = this.sequence(klass, properties[property].sequence);
          } else if(properties[property].factory != undefined) {
          } else if(properties[property].factories != undefined) {
          } else {
            properties[property] = properties[property];
          }
        }
        return new window[klass](properties);
      } else {
        return null;
      }
    },

    define: function(klass, properties) {
      if(!this._factory_exists(klass)) {
        this.factories.push({klass: klass, properties: properties, sequences: {}});
      } else {
        var factory = this._factory_fetch(klass);
        factory.properties = properties;
      }
    },

    sequence: function(klass, property) {
      if(this._factory_exists(klass)) {
        var factory = this._factory_fetch(klass);
      } else {
        this.define(klass, {});
        var factory = this._factory_fetch(klass);
      }
      if(factory.sequences[property] != undefined) {
        factory.sequences[property] += 1;
      } else {
        factory.sequences[property] = 1;
      }
      return factory.sequences[property];
    },

    _merge_properties: function(original, source) {
      var original_copy = {};
      for(property in original) {
        original_copy[property]  = original[property];
      }
      for(property in source) {
        original_copy[property] = source[property];
      }
      return original_copy;
    },

    _factory_fetch: function(klass) {
      for(factory in this.factories) {
        if(this.factories[factory].klass == klass) {
          return this.factories[factory];
        }
      }
      return null;
    },

    _factory_exists: function(klass) {
      for(factory in this.factories) {
        if(this.factories[factory].klass == klass) {
          return true;
        }
      }
      return false;
    }
  }
});

Factory.define('Address', {
  id: {
    sequence: 'id'
  },
  person: {
    factory: 'Person'
  },
  first_line: '555 Street Way',
  second_line: 'Suite 309',
  city: 'Lincoln',
  state: 'NE',
  province: '',
  country: 'US',
  zip: '68508'
});

Factory.define('Customer', {
  id: {
    sequence: 'id'
  },
  person: {
    factory: 'Person'
  },
  credit: 1000,
  drivers_license_number: 'H12000000',
  drivers_license_state: 'NE',
  notes: 'Lorem Ipsum...',
  active: true
});

Factory.define('Email', {
  id: {
    sequence: 'id'
  },
  person: {
    factory: 'Person'
  },
  address: 'example@example.com'
});

Factory.define('Employee', {
  id: {
    sequence: 'id'
  },
  person: {
    factory: 'Person'
  },
  rate: 0,
  active: true
});

Factory.define('Entry', {
  id: {
    sequence: 'id'
  },
  till: {
    factory: 'Till'
  },
  title: 'Title',
  description: 'Lorem Ipsum...',
  time: new Date(),
  amount: 0
});

Factory.define('Item', {
  id: {
    sequence: 'id'
  },
  properties: {
    factories: 'Property'
  },
  title: 'Title',
  description: 'Lorem Ipsum...',
  sku: {
    sequence: 'sku'
  },
  price: 1000,
  taxable: true,
  discountable: false,
  locked: false,
  active: true
});

Factory.define('Line', {
  id: {
    sequence: 'id'
  },
  properties: {
    factories: 'Item'
  },
  quantity: 1,
  price: 1000
});

Factory.define('Payment', {
  id: {
    sequence: 'id'
  },
  transaction: {
    factory: 'Transaction'
  },
  form: 'cash',
  amount: 0
});

Factory.define('Person', {
  id: {
    sequence: 'id'
  },
  phones: {
    factories: 'Phone'
  },
  emails: {
    factories: 'Email'
  },
  addresses: {
    factories: 'Address'
  },
  first_name: 'Joe',
  middle_name: 'Q',
  last_name: 'Example',
  date_of_birth: new Date()
});

Factory.define('Phone', {
  id: {
    sequence: 'id'
  },
  person: {
    factory: 'Person'
  },
  title: 'Work',
  number: '402-444-5555'
});

Factory.define('Property', {
  id: {
    sequence: 'id'
  },
  key: 'foo',
  value: 'bar'
});

Factory.define('Till', {
  id: {
    sequence: 'id'
  },
  title: 'Title'
});

Factory.define('Timecard', {
  id: {
    sequence: 'id'
  },
  employee: {
    factory: 'Employee'
  },
  begin: new Date(),
  end: new Date()
});

Factory.define('Transaction', {
  id: {
    sequence: 'id'
  },
  till: {
    factory: 'Till'
  },
  customer: {
    factory: 'Customer'
  },
  lines: {
    factories: 'Line'
  },
  payments: {
    factories: 'Payment'
  },
  tax_rate: 0.07,
  complete: false,
  locked: false
});

Factory.define('User', {
  id: {
    sequence: 'id'
  },
  person: {
    factory: 'Person'
  },
  login: 'login',
  email: 'example@example.com',
  pin: '1111',
  active: true
});
var ViewController = new JS.Class({

  initialize: function(view) {
    this.view = $(view);
  }
});

var TillController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    $('ul#till_nav a.select', view).bind('click', {instance: this}, this.doSelect);
  },

  doSelect: function(event) {
    event.data.instance.notifyObservers(Till.find($('div#till select#till_id').val()));
    event.preventDefault();
  }
});
var Sectionable = new JS.Module({

  show: function() {
    if(this.view != null && this.view != undefined) {
      this.view.show();
    }
  },

  hide: function() {
    if(this.view != null && this.view != undefined) {
      this.view.hide();
    }
  }
});

var SearchController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.page = 1;
    this.query = null;

    this.input = $('input.query', this.view);
    this.input.bind('change', {instance: this}, this.onChange);
    this.alphabet_controller = new AlphabetController($('ul.alphabet_nav', this.view));
    this.alphabet_controller.addObserver(this.onLetter, this);
    $('a.clear', this.view).bind('click', {instance: this}, this.onClear);
    $('a.prev', this.view).bind('click', {instance: this}, this.onPrev);
    $('a.next', this.view).bind('click', {instance: this}, this.onNext);
    $('form', this.view).submit(function(event) {
      event.preventDefault();
    });
    this.reset();
  },

  reset: function() {
    this.input.val(null);
  },

  showLoading: function() {
    $('img.loading', this.view).show();
  },

  hideLoading: function() {
    $('img.loading', this.view).hide();
  },

  onLetter: function(letter) {
    this.input.val(letter);
    this.input.trigger('change');
  },

  onPrev: function(event) {
    if(event.data.instance.query != null) {
      if(event.data.instance.page > 1) {
        event.data.instance.page -= 1;
      }
      event.data.instance.notifyObservers(event.data.instance.query, event.data.instance.page);
    }
    event.preventDefault();
  },

  onNext: function(event) {
    if(event.data.instance.query != null) {
      event.data.instance.page += 1;
      event.data.instance.notifyObservers(event.data.instance.query, event.data.instance.page);
    }
    event.preventDefault();
  },

  onClear: function(event) {
    event.data.instance.page = 1;
    event.data.instance.query = null;
    event.data.instance.input.val(null);
    event.preventDefault();
  },

  onChange: function(event) {
    event.data.instance.page = 1;
    event.data.instance.query = event.data.instance.input.val();
    if(query.length > 0) {
      event.data.instance.notifyObservers(event.data.instance.query, 1);
    }
    event.preventDefault();
  }
});

var FormController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();

    $('a.clear', this.view).bind('click', {instance: this}, this.onClear);
    $('a.save', this.view).bind('click', {instance: this}, this.onSave);
    $('form', this.view).submit(function(event) {
      event.preventDefault();
    });
  },

  reset: function() {
    $(':input', this.view)
      .not(':button, :submit, :reset')
      .val(null)
      .removeAttr('checked')
      .removeAttr('selected');
  },

  update: function(data) {
  },

  save: function() {
  },

  onClear: function(event) {
    event.data.instance.reset();
    event.preventDefault();
  },

  onSave: function(event) {
    event.data.instance.save();
    event.preventDefault();
  }
});

var CustomerFormController = new JS.Class(FormController, {
  include: Sectionable,

  initialize: function(view) {
    this.callSuper();
  },

  update: function(customer) {
    this.reset();

    $('input#customer_id', this.view).val(customer.id);
    $('input#customer_credit', this.view).val(Currency.format(customer.credit));
    $('input#customer_drivers_license_number', this.view).val(customer.drivers_license_number);
    $('input#customer_drivers_license_state', this.view).val(customer.drivers_license_state);
    $('input#customer_flagged', this.view).attr('checked', !customer.active);
    $('textarea#customer_notes', this.view).val(customer.notes);

    person = customer.person();
    if(person != undefined) {
      $('input#customer_person_first_name', this.view).val(person.first_name);
      $('input#customer_person_middle_name', this.view).val(person.middle_name);
      $('input#customer_person_last_name', this.view).val(person.last_name);

      addresses = person.addresses();
      if(addresses.length > 0) {
        $('input#customer_person_address_first_line', this.view).val(addresses[0].first_line);
        $('input#customer_person_address_second_line', this.view).val(addresses[0].second_line);
        $('input#customer_person_address_city', this.view).val(addresses[0].city);
        $('input#customer_person_address_state', this.view).val(addresses[0].state);
        $('input#customer_person_address_zip', this.view).val(addresses[0].zip);
      }

      phones = person.phones();
      if(phones.length > 0){
        $('input#customer_person_phone_number', this.view).val(phones[0].number);
      }

      emails = person.emails();
      if(emails.length > 0){
        $('input#customer_person_email_address', this.view).val(emails[0].address);
      }
    }
  },

  save: function() {
    if(this.valid()) {
      if($('input#customer_id', this.view).val() > 0) {
        customer = Customer.find($('input#customer_id', this.view).val());
        customer.credit = parseInt(Currency.toPennies($('input#customer_credit', this.view).val()));
        customer.notes = $('textarea#customer_notes', this.view).val();
        customer.drivers_license_number = $('input#customer_drivers_license_number', this.view).val();
        customer.drivers_license_state = $('input#customer_drivers_license_state', this.view).val();
        customer.active = !$('input#customer_flagged', this.view).is(':checked');
        customer.save();

        if(customer != undefined) {
          person = customer.person();
          if(person != undefined) {
            person.first_name = $('input#customer_person_first_name', this.view).val();
            person.middle_name = $('input#customer_person_middle_name', this.view).val();
            person.last_name = $('input#customer_person_last_name', this.view).val();
            person.save();

            addresses = person.addresses();
            if(addresses.length > 0) {
              addresses[0].first_line =  $('input#customer_person_address_first_line', this.view).val();
              addresses[0].second_line = $('input#customer_person_address_second_line', this.view).val();
              addresses[0].city = $('input#customer_person_address_city', this.view).val();
              addresses[0].state = $('input#customer_person_address_state', this.view).val();
              addresses[0].zip = $('input#customer_person_address_zip', this.view).val();
              addresses[0].save();
            } else {
              address = new Address({
                first_line: $('input#customer_person_address_first_line', this.view).val(),
                second_line: $('input#customer_person_address_second_line', this.view).val(),
                city: $('input#customer_person_address_city', this.view).val(),
                state: $('input#customer_person_address_state', this.view).val(),
                zip: $('input#customer_person_address_zip', this.view).val(),
              });
              address.setPerson(person);
              address.save();
            }

            phones = person.phones();
            if(phones.length > 0) {
              phones[0].number =  $('input#customer_person_phone_number', this.view).val();
              phones[0].save();
            } else {
              phone = new Phone({
                number: $('input#customer_person_phone_number', this.view).val()
              });
              phone.setPerson(person);
              phone.save();
            }

            emails = person.emails();
            if(emails.length > 0) {
              emails[0].address =  $('input#customer_person_email_address', this.view).val();
              emails[0].save();
            } else {
              email = new Email({
                address: $('input#customer_person_email_address', this.view).val()
              });
              email.setPerson(person);
              email.save();
            }

            customer.setPerson(person);
          }
        }
      } else {
        person = new Person({
          first_name: $('input#customer_person_first_name', this.view).val(),
          middle_name: $('input#customer_person_middle_name', this.view).val(),
          last_name: $('input#customer_person_last_name', this.view).val()
        });
        if(person.save()) {
          address = new Address({
            first_line: $('input#customer_person_address_first_line', this.view).val(),
            second_line: $('input#customer_person_address_second_line', this.view).val(),
            city: $('input#customer_person_address_city', this.view).val(),
            state: $('input#customer_person_address_state', this.view).val(),
            zip: $('input#customer_person_address_zip', this.view).val(),
          });
          address.setPerson(person);
          address.save();

          phone = new Phone({
            number: $('input#customer_person_phone_number', this.view).val()
          });
          phone.setPerson(person);
          phone.save();

          email = new Email({
            address: $('input#customer_person_email_address', this.view).val()
          });
          email.setPerson(person);
          email.save();
        }

        customer = new Customer({
          credit: parseInt(Currency.toPennies($('input#customer_credit', this.view).val())),
          notes: $('textarea#customer_notes', this.view).val(),
          drivers_license_number: $('input#customer_drivers_license_number', this.view).val(),
          drivers_license_state: $('input#customer_drivers_license_state', this.view).val(),
          active: !$('input#customer_flagged', this.view).is(':checked')
        });
        customer.setPerson(person);
      }
      if(customer.save()) {
        this.update(customer);
        this.notifyObservers(customer);
      }
    } else {
      this.error();
    }
  },

  valid: function() {
    if($('input#customer_person_first_name', this.view).val() == '') {
      return false;
    }
    if($('input#customer_person_last_name', this.view).val() == '') {
      return false;
    }
    if($('input#customer_person_phone_number', this.view).val() == '' &&
       $('input#customer_person_email_address', this.view).val() == '' &&
       $('input#customer_drivers_license_number', this.view).val() == '' &&
       $('input#customer_drivers_license_number', this.view).val() == '') {
      return false;
    }
    return true;
  },

  error: function() {
    $(':required', this.view).addClass('error');
  },

  reset: function() {
    this.callSuper();
    $('input#customer_id', this.view).val(0);
    $('input#customer_credit', this.view).val(Currency.format(0));
    $(':required', this.view).removeClass('error');
  }
});

var TableController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.table_row = $('tbody > tr', view).detach();
    this.reset();
    $('tbody > tr', view).live('click', {instance: this}, this.onSelect);
  },

  reset: function() {
    $('tbody > tr', this.view).remove();
  },

  update: function(data) {
  },

  onSelect: function(event) {
    $('tbody > tr', event.data.instance.view).removeClass('selected');
    $(this).addClass('selected');
    event.data.instance.notifyObservers($(this).attr('data-object-id'));
  }
});
var Boolean = new JS.Class({
  extend: {
    toString: function(boolean) {
      return boolean ? 'Yes' : 'No'
    }
  }
});

var CustomerTableController = new JS.Class(TableController, {

  update: function(people) {
    this.reset();

    if(people.length > 0) {
      for(person in people){
        new_row = $(this.table_row).clone();
        new_row.attr('data-object-id', people[person].id);

        $('td.name', new_row).html([
          people[person].first_name,
          people[person].last_name
        ].join(' '));

        addresses = people[person].addresses();
        for(address in addresses) {
          address_string = [
            addresses[address].first_line,
            addresses[address].second_line,
            addresses[address].city + ',',
            addresses[address].state,
            addresses[address].province,
            addresses[address].country,
            addresses[address].zip
          ].join(' ');
          $('td.address', new_row).append($('<address></address>').html(address_string));
        }

        phones = people[person].phones();
        for(phone in phones) {
          if(phones[phone].title != null) {
            phone_string = phones[phone].title + ' - ' + phones[phone].number;
          } else {
            phone_string = phones[phone].number;
          }
          $('td.phone', new_row).append($('<p></p>').html(phone_string));
        }

        emails = people[person].emails();
        for(email in emails) {
          email_string = emails[email].address;
          $('td.email', new_row).append($('<p></p>').html(email_string));
        }

        customer = people[person].customer();
        if(customer != undefined) {
          $('td.credit', new_row).html(Currency.pretty(customer.credit));
          $('td.drivers_license', new_row).html([
            customer.drivers_license_number,
            customer.drivers_license_state
          ].join(' '));
          $('td.flagged', new_row).html(Boolean.toString(!customer.active));
          $('td.notes', new_row).html(customer.notes);
          $('tbody', this.view).append(new_row);
        }
      }
      this.view.show();
    } else {
      this.view.hide();
    }
  }
});

var CustomerSearchResultsController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],

  initialize: function(view) {
    this.callSuper();
    this.customer_table_controller = new CustomerTableController($('table', this.view));
    this.customer_table_controller.addObserver(this.onPerson, this);
  },

  reset: function() {
    this.customer_table_controller.reset();
  },

  update: function(results) {
    if(results.length > 0) {
      $('h2#customer_search_results_notice').hide();
    } else {
      $('h2#customer_search_results_notice').show();
    }
    this.customer_table_controller.update(results);
  },

  onPerson: function(id) {
    this.notifyObservers(Person.find(id).customer());
  }
});

var CustomerController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],

  initialize: function(view) {
    this.callSuper();
    this.customer_review_controller = new CustomerReviewController('div#customer_review');
    this.customer_form_controller = new CustomerFormController('div#customer_form');
    this.customer_search_controller = new SearchController('div#customer_search');
    this.customer_search_results_controller = new CustomerSearchResultsController('div#customer_search_results');
    this.customer_section_controller = new SectionController('ul#customer_nav', [
      this.customer_review_controller,
      this.customer_form_controller,
      this.customer_search_results_controller
    ]);
    this.customer_search_controller.addObserver(this.search, this);
    this.customer_search_controller.addObserver(this.showSearchController, this);
    this.customer_search_results_controller.addObserver(this.setCustomer, this);
    this.customer_form_controller.addObserver(this.setCustomer, this);

    this.reset();
  },

  reset: function() {
    this.customer_review_controller.reset();
    this.customer_form_controller.reset();
    this.customer_search_controller.reset();
    this.customer_search_results_controller.reset();
    this.customer_section_controller.reset();
    this.showReviewSection();
  },

  search: function(query, page) {
    if(page == undefined || page == null) {
      page = 1;
    }
    if(query.length > 1) {
      pattern = 'first_name_or_last_name_contains_any';
    } else {
      pattern = 'last_name_starts_with';
    }
    this.customer_search_results_controller.update(Person.search(pattern, query.split(' '), page, 10, this.customer_search_controller.showLoading, this.customer_search_controller.hideLoading));
  },

  showReviewSection: function() {
    this.customer_section_controller.showController(0);
  },

  showFormController: function() {
    this.customer_section_controller.showController(1);
  },

  showSearchController: function(query) {
    if(query) {
      this.customer_section_controller.showController(2);
    }
  },

  setCustomer: function(customer) {
    this.customer_review_controller.update(customer);
    this.customer_form_controller.update(customer);
    this.showReviewSection();
    this.notifyObservers(customer);
  }
});

var CartLineController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view, index, line, open) {
    this.callSuper();
    this.line_index = index;
    this.line = line;
    this.open = open;
    this.set(line);
    $('a.remove', this.view).bind('click', {instance: this}, this.onRemove);
    $('a.info', this.view).bind('click', {instance: this}, this.onInfo);
    $('a.plus', this.view).bind('click', {instance: this}, this.onPlus);
    $('a.minus', this.view).bind('click', {instance: this}, this.onMinus);
    $('ul.cart_line_action li a', this.view).bind('click', {instance: this}, this.onAction);
    $('ul.cart_line_sell_condition li a', this.view).bind('click', {instance: this}, this.onCondition);
    $('ul.cart_line_purchase_discount li a', this.view).bind('click', {instance: this}, this.onDiscount);
    $('form', this.view).bind('submit', {instance: this}, this.onSubmit);
  },

  set: function(line) {

    $('input.quantity', this.view).val(line.quantity);
    $('hgroup.cart_line_information h3.cart_line_title', this.view).html(line.title);
    if(line.description != undefined) {
      $('hgroup.cart_line_information h4.cart_line_description', this.view).html(line.description.truncate(50));
    }
    $('h4.cart_line_subtotal', this.view).html(Currency.pretty(line.subtotal()));
    $('ul.cart_line_action li a', this.view).removeClass('selected');
    $('span.cart_line_credit_value', this.view).html('Credit Value: ' + Currency.pretty(Math.round(line.credit * line.condition)));
    $('span.cart_line_cash_value', this.view).html('Cash Value: ' + Currency.pretty(Math.round(line.cash * line.condition)));
    $('ul.cart_line_sell_condition li a', this.view).removeClass('selected');
    $('ul.cart_line_sell_condition li a', this.view).eq(Math.round((line.condition * 5) - 1)).addClass('selected');
    $('ul.cart_line_purchase_discount li a', this.view).removeClass('selected');
    $('ul.cart_line_purchase_discount li a', this.view).eq(Math.round(((1 - line.discount) * 100) / 5)).addClass('selected');
    if(line.purchase) {
      $('ul.cart_line_action li a.purchase', this.view).addClass('selected');
      if(line.discountable) {
        this.showPurchaseControls();
      }
      this.hideSellControls();
    } else {
      $('ul.cart_line_action li a.sell', this.view).addClass('selected');
      this.showSellControls();
      this.hidePurchaseControls();
    }
    if(this.isOpen()) {
      $('div.cart_info', this.view).css('display', 'block');
    }
  },

  isOpen: function() {
    return this.open;
  },

  toggleInfo: function() {
    if(this.open) {
      this.open = false;
      $('div.cart_info', this.view).hide();
    } else {
      this.open = true;
      $('div.cart_info', this.view).show();
    }
  },

  setPurchase: function() {
    this.line.purchase = true;
    this.notifyObservers(this.line_index, this.line);
  },

  setSell: function() {
    this.line.purchase = false;
    this.notifyObservers(this.line_index, this.line);
  },

  onDiscount: function(event) {
    index = $('ul.cart_line_purchase_discount li a', event.data.instance.view).index(this);
    event.data.instance.line.discount = (1 - ($('ul.cart_line_purchase_discount li a').eq(index).attr('data-discount') / 100));
    event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    event.preventDefault();
  },

  onCondition: function(event) {
    index = $('ul.cart_line_sell_condition li a', event.data.instance.view).index(this);
    event.data.instance.line.condition = ($('ul.cart_line_sell_condition li a').eq(index).attr('data-condition') / 5);
    event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    event.preventDefault();
  },

  onInfo: function(event) {
    $('div.cart_info', event.data.instance.view).toggle();
    event.data.instance.open = !event.data.instance.open;
    event.preventDefault();
  },

  onPlus: function(event) {
    quantity = $('input.quantity', event.data.instance.view).val();
    event.data.instance.line.quantity = parseInt(quantity) + 1;
    event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    event.preventDefault();
  },

  onMinus: function(event) {
    quantity = $('input.quantity', event.data.instance.view).val();
    if(quantity > 1) {
      event.data.instance.line.quantity = parseInt(quantity) - 1;
      event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    }
    event.preventDefault();
  },

  onSubmit: function(event) {
    quantity = $('input.quantity', event.data.instance.view).val();
    if(quantity >= 1) {
      event.data.instance.line.quantity = parseInt(quantity);
      event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    } else {
      $('input.quantity', event.data.instance.view).val(1);
    }
    event.preventDefault();
  },

  onAction: function(event) {
    index = $('ul.cart_line_action li a', event.data.instance.view).index(this);
    if(index == 0) {
      event.data.instance.setPurchase();
    } else {
      event.data.instance.setSell();
    }
    event.preventDefault();
  },

  onRemove: function(event) {
    event.data.instance.line.quantity = 0;
    event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    event.preventDefault();
  },

  showSellControls: function() {
    $('ul.cart_line_sell_control', this.view).css('display', 'block');
  },

  hideSellControls: function() {
    $('ul.cart_line_sell_control', this.view).hide();
  },

  showPurchaseControls: function() {
    $('ul.cart_line_purchase_control', this.view).css('display', 'block');
  },

  hidePurchaseControls: function() {
    $('ul.cart_line_purchase_control', this.view).hide();
  }
});

var CartLinesController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],

  initialize: function(view) {
    this.callSuper();
    this.lines = [];
    this.line_controllers = [];
    this.line = $('li.cart_line', this.view).detach();
    this.hideCartNav();
    $('ul#cart_lines_nav a.remove', this.view).bind('click', {instance: this}, this.onRemove);
    $('ul#cart_lines_nav a.info', this.view).bind('click', {instance: this}, this.onInfo);
    $('ul#cart_lines_nav a.purchase', this.view).bind('click', {instance: this}, this.onPurchase);
    $('ul#cart_lines_nav a.sell', this.view).bind('click', {instance: this}, this.onSell);
  },

  reset: function() {
    this.lines = [];
    this.line_controllers = [];
    this.clearLines();
    this.showCartNotice();
    this.hideCartNav();
  },

  add: function(lines) {
    this.clearLines();
    for(line in lines) {
      this.lines.push(lines[line]);
    }
    this.setLines(this.lines);
    this.notifyObservers(this.lines);
  },

  replace: function(lines) {
    this.clearLines();
    this.lines = lines;
    this.setLines(this.lines);
    this.notifyObservers(this.lines);
  },

  setLines: function(lines) {
    opened = [];
    for(controller in this.line_controllers) {
      if(this.line_controllers[controller].isOpen()) {
        opened.push(controller);
      }
    }
    this.line_controllers = [];
    for(line in lines) {
      is_open = false;
      for(index in opened) {
        if(line == opened[index]) {
          is_open = true;
        }
      }
      if(is_open) {
        new_line = new CartLineController(this.line.clone(), line, lines[line], true);
      } else {
        new_line = new CartLineController(this.line.clone(), line, lines[line], false);
      }
      new_line.addObserver(this.updateLine, this);
      this.line_controllers.push(new_line);
      $('ul#cart_lines', this.view).append(new_line.view);
    }
    if(lines.length > 0) {
      this.showCartNav();
      this.hideCartNotice();
    } else {
      this.hideCartNav();
      this.showCartNotice();
    }
  },

  clearLines: function() {
    $('ul#cart_lines > li').remove();
  },

  updateLine: function(index, updated_line) {
    if(updated_line.quantity > 0) {
      this.lines[index] = updated_line;
    } else {
      this.lines.splice(index, 1);
    }
    this.replace(this.lines);
  },

  onRemove: function(event) {
    event.data.instance.reset();
    event.data.instance.lines = [];
    event.data.instance.line_controllers = [];
    event.data.instance.notifyObservers(event.data.instance.lines);
    event.preventDefault();
  },

  onInfo: function(event) {
    for(controller in event.data.instance.line_controllers) {
      event.data.instance.line_controllers[controller].toggleInfo();
    }
    event.preventDefault();
  },

  onPurchase: function(event) {
    for(controller in event.data.instance.line_controllers) {
      event.data.instance.line_controllers[controller].setPurchase();
    }
    event.preventDefault();
  },

  onSell: function(event) {
    for(controller in event.data.instance.line_controllers) {
      event.data.instance.line_controllers[controller].setSell();
    }
    event.preventDefault();
  },

  showCartNav: function() {
    $('ul#cart_lines_nav', this.view).show();
  },

  hideCartNav: function() {
    $('ul#cart_lines_nav', this.view).hide();
  },

  showCartNotice: function() {
    $('h2#cart_lines_notice', this.view).show();
  },

  hideCartNotice: function() {
    $('h2#cart_lines_notice', this.view).hide();
  }
});

var CartFormController = new JS.Class(FormController, {
  include: Sectionable,

  initialize: function(view) {
    this.callSuper();
    this.row = $('ul.line_elements', view).first().clone();

    $('input.price', this.view).bind('change', {instance: this}, this.onPrice);
    $('a.more', this.view).bind('click', {instance: this}, this.onMore);
    $('a.less', this.view).bind('click', {instance: this}, this.onLess);
    $('a.clear_all', this.view).live('click', {instance: this}, this.onClearAll);
    $('a.add_all', this.view).live('click', {instance: this}, this.onAddAll);
    $('a.clear_row', this.view).live('click', {instance: this}, this.onClearRow);
    $('a.add_row', this.view).live('click', {instance: this}, this.onAddRow);
  },

  saveAll: function() {
    var controller = this;
    $('ul.line_elements', this.view).each(function(index, value) {
      controller.saveLine(index);
    });
  },

  saveLine: function(index) {
    new_line = $('ul.line_elements', this.view).eq(index);

    base_price = parseInt(Currency.toPennies($('input#line_price', new_line).val()));
    if(base_price <= 0) {
      base_price = 0;
    }
    credit_price = parseInt(Currency.toPennies($('input#line_credit', new_line).val()));
    if(credit_price <= 0) {
      credit_price = 0;
    }
    cash_price = parseInt(Currency.toPennies($('input#line_cash', new_line).val()));
    if(cash_price <= 0) {
      cash_price = 0;
    }

    line = new Line({
      title: $('input#line_title', new_line).val(),
      description: $('input#line_description', new_line).val(),
      quantity: parseInt(Math.abs($('input#line_quantity', new_line).val())),
      condition: 1,
      discount: 1,
      price: base_price,
      credit: credit_price,
      cash: cash_price,
      purchase: true,
      taxable: $('input#line_taxable', new_line).attr('checked'),
      discountable: $('input#line_discountable', new_line).attr('checked')
    });

    if(this.valid([line])) {
      this.notifyObservers([line]);
    }
  },

  valid: function(lines) {
    for(l in lines) {
      if(lines[l].valid()) {
        if((lines[l].price > 0 || lines[l].credit > 0 || lines[l].cash > 0) && lines[l].quantity > 0) {
          return true;
        }
        return false;
      } else {
        return false;
      }
    }
    return false;
  },

  reset: function() {
    this.callSuper();
    $('input#line_quantity', this.view).val(1);
    $('input#line_taxable', this.view).attr('checked', true);
    $('input#line_discountable', this.view).attr('checked', true);
  },

  onPrice: function(event) {
    value = $(this).val();
    if(isNaN(value)) {
      $(this).val(Currency.format(0));
    } else {
      $(this).val(Currency.format(Currency.toPennies(Math.abs(value))));
    }
  },

  onMore: function(event) {
    $('form', event.data.instance.view).append(event.data.instance.row.clone());
    event.preventDefault();
  },

  onLess: function(event) {
    $('ul.line_elements', event.data.instance.view).last().remove();
    event.preventDefault();
  },

  onAddAll: function(event) {
    event.data.instance.saveAll();
    event.preventDefault();
  },

  onClearAll: function(event) {
    event.data.instance.reset();
    event.preventDefault();
  },

  onClearRow: function(event) {
    $(this)
      .closest('ul')
      .find(':input')
      .not(':button, :submit, :reset, :hidden')
      .val(null)
      .removeAttr('checked')
      .removeAttr('selected')
    $(this)
      .closest('ul')
      .find('input#line_quantity').val(1);
    $(this)
      .closest('ul')
      .find('input#line_taxable').attr('checked', true);
    $(this)
      .closest('ul')
      .find('input#line_discountable').attr('checked', true);
    event.preventDefault();
  },

  onAddRow: function(event) {
    event.data.instance.saveLine($('ul.line_elements li > a.add_row', event.data.instance.view).index(this));
    event.preventDefault();
  }
});

var CartTableController = new JS.Class(TableController, {

  update: function(items) {
    this.reset();

    if(items.length > 0) {
      for(item in items){
        new_row = $(this.table_row).clone();
        new_row.attr('data-object-id', items[item].id);

        if(items[item].description == null || items[item].description == undefined) {
          items[item].description = '';
        }

        $('td.title', new_row).html(items[item].title);
        $('td.description', new_row).html(items[item].description.truncate(50)).attr('title', items[item].description);
        $('td.sku', new_row).html(items[item].sku);
        $('td.price', new_row).html(Currency.pretty(items[item].price));
        $('td.credit', new_row).html(Currency.pretty(items[item].credit));
        $('td.cash', new_row).html(Currency.pretty(items[item].cash));
        $('td.taxable', new_row).html(Boolean.toString(items[item].taxable));
        $('td.discountable', new_row).html(Boolean.toString(items[item].discountable));

        properties = items[item].properties();
        for(property in properties) {
          processed = this._processProperty(properties[property]);
          $('td.properties ul', new_row).append('<li><span>' + processed.key + ': </span><span>' + processed.value + '</span></li>');
        }
        $('tbody', this.view).append(new_row);
      }
      this.view.show();
    } else {
      this.view.hide();
    }
  },

  _processProperty: function(property) {
    property.key = property.key.split('_').join(' ').capitalize();
    return property;
  }
});

var CartSearchResultsController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],

  initialize: function(view) {
    this.callSuper();
    this.cart_table_controller = new CartTableController($('table', this.view));
    this.cart_table_controller.addObserver(this.onItem, this);
  },

  reset: function() {
    this.cart_table_controller.reset();
  },

  update: function(results) {
    if(results.length > 0) {
      $('h2#cart_search_results_notice').hide();
    } else {
      $('h2#cart_search_results_notice').show();
    }
    this.cart_table_controller.update(results);
  },

  onItem: function(id) {
    item = Item.find(id);
    this.notifyObservers([new Line({
      item_id: item.id,
      title: item.title,
      description: item.description,
      quantity: 1,
      condition: 1,
      discount: 1,
      price: item.price,
      credit: item.credit,
      cash: item.cash,
      purchase: true,
      taxable: item.taxable,
      discountable: item.discountable
    })]);
  }
});

var CartController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],

  initialize: function(view) {
    this.callSuper();
    this.cart_lines_controller = new CartLinesController('div#cart_lines');
    this.cart_form_controller = new CartFormController('div#cart_form');
    this.cart_search_controller = new SearchController('div#cart_search');
    this.cart_search_results_controller = new CartSearchResultsController('div#cart_search_results');
    this.cart_section_controller = new SectionController('ul#cart_nav', [
      this.cart_lines_controller,
      this.cart_form_controller,
      this.cart_search_results_controller
    ]);
    this.cart_search_controller.addObserver(this.search, this);
    this.cart_search_controller.addObserver(this.showSearchController, this);
    this.cart_lines_controller.addObserver(this.setLines, this);
    this.cart_search_results_controller.addObserver(this.addLines, this);
    this.cart_form_controller.addObserver(this.addLines, this);

    this.reset();
  },

  reset: function() {
    this.cart_lines_controller.reset();
    this.cart_form_controller.reset();
    this.cart_search_controller.reset();
    this.cart_search_results_controller.reset();
    this.cart_section_controller.reset();
    $('h2#cart_summary', this.view).html('0 item(s): ' + Currency.pretty(0));
    this.showLinesController();
  },

  search: function(query, page) {
    if(page == undefined || page == null) {
      page = 1;
    }
    if(query.length > 1) {
      pattern = 'title_or_description_or_sku_contains_any';
    } else {
      pattern = 'title_starts_with';
    }
    this.cart_search_results_controller.update(Item.search(pattern, query.split(' '), page, 10, this.cart_search_controller.showLoading, this.cart_search_controller.hideLoading));
  },

  update: function(transaction) {
    $('h2#cart_summary', this.view).html(transaction.countItems() + ' item(s): ' + Currency.pretty(transaction.subtotal()));
  },

  showLinesController: function() {
    this.cart_section_controller.showController(0);
  },

  showFormController: function() {
    this.cart_section_controller.showController(1);
  },

  showSearchController: function() {
    this.cart_section_controller.showController(2);
  },

  addLines: function(lines) {
    this.cart_lines_controller.add(lines);
  },

  setLines: function(lines) {
    this.notifyObservers(lines);
  }
});

var PaymentFieldController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.enabled = false;
    this.amount_due = 0;
    $('input.payment', this.view).bind('change', {instance: this}, this.onChange);
  },

  reset: function() {
    this.amount_due = 0;
    $('input.payment', this.view).val(null);
  },

  enable: function() {
    this.enabled = true;
    $('input.payment', this.view).attr('disabled', false);
  },

  disable: function() {
    this.enabled = false;
    $('input.payment', this.view).attr('disabled', true);
  },

  set: function(amount) {
    $('input.payment', this.view).val(Math.abs(amount));
    $('input.payment', this.view).trigger('change');
  },

  update: function(amount, amount_due) {
    if(amount_due > 0) {
      this.amount_due = amount_due;
    } else {
      this.amount_due = 0;
    }

    if(amount > 0) {
      $('input.payment', this.view).val(Currency.format(amount));
    } else {
      $('input.payment', this.view).val(null);
    }
  },

  onChange: function(event) {
    if(!isNaN($(this).val())) {
      event.data.instance.notifyObservers(new Payment({form: $(this).attr('data-payment-form'), amount: Currency.toPennies(Math.abs($(this).val()))}));
    } else {
      $(this).val(null);
    }
  }
});

var PaymentLineController = new JS.Class(PaymentFieldController, {

  initialize: function(view) {
    this.callSuper();
    $('a.clear', this.view).bind('click', {instance: this}, this.onClear);
    $('a.amount_due', this.view).bind('click', {instance: this}, this.onAmountDue);
    $('form', this.view).submit(function(event) {
      event.preventDefault();
    });
  },

  onAmountDue: function(event) {
    if(event.data.instance.amount_due != 0 && event.data.instance.enabled) {
      input = $('input.payment', event.data.instance.view);
      input.val(Currency.format(event.data.instance.amount_due));
      input.trigger('change');
    }
    event.preventDefault();
  },

  onClear: function(event) {
    if(event.data.instance.enabled) {
      input = $('input.payment', event.data.instance.view);
      input.val(null);
      input.trigger('change');
    }
    event.preventDefault();
  }
});

var PaymentCashController = new JS.Class(PaymentLineController, {

  initialize: function(view) {
    this.callSuper();
    $('a.denomination', this.view).bind('click', {instance: this}, this.onDenomination);
  },

  onDenomination: function(event) {
    if(event.data.instance.enabled) {
      input = $('input.payment', event.data.instance.view);
      amount = parseFloat($(this).attr('data-denomination'));
      current_amount = parseFloat(input.val());
      if(isNaN(current_amount)) {
        current_amount = 0;
      }
      input.val(Currency.format(Currency.toPennies(amount + current_amount)));
      input.trigger('change');
    }
    event.preventDefault();
  }
});

var PaymentStoreCreditController = new JS.Class(PaymentLineController, {

  initialize: function(view) {
    this.callSuper();
    this.reset();
  },

  reset: function() {
    this.callSuper();
    this.disable();
    this.customer = undefined;
    $('div#payment_store_credit span#payment_customer').empty();
  },

  setCustomer: function(customer) {
    if(customer != undefined) {
      this.customer = customer;
      person = customer.person();
      if(person != undefined) {
        $('div#payment_store_credit span#payment_customer').html(person.first_name + ' ' + person.last_name + ': ' + Currency.pretty(customer.credit));
      } else {
        $('div#payment_store_credit span#payment_customer').empty();
      }
      this.enable();
    } else {
      this.disable();
    }
  },

  onApply: function(event) {
    if(event.data.instance.amount_due != 0 && event.data.instance.enabled) {
      input = $('input.payment', event.data.instance.view);
      if(event.data.instance.amount_due > event.data.instance.customer.credit) {
        input.val(Currency.format(event.data.instance.customer.credit));
      } else {
        input.val(Currency.format(event.data.instance.amount_due));
      }
      input.trigger('change');
    }
    event.preventDefault();
  },

  onChange: function(event) {
    amount = $(this).val();
    if(!isNaN(amount)) {
      if(Currency.toPennies(amount) > event.data.instance.customer.credit) {
        amount = Currency.format(event.data.instance.customer.credit);
      }
      if(Currency.toPennies(amount) > event.data.instance.amount_due) {
        amount = Currency.format(event.data.instance.amount_due);
      }
      event.data.instance.notifyObservers(new Payment({form: $(this).attr('data-payment-form'), amount: Currency.toPennies(Math.abs(amount))}));
    } else {
      $(this).val(null);
    }
  }

});

var PaymentPayoutController = new JS.Class(PaymentFieldController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
  },

  update: function(amount) {
    if(amount < 0) {
      $('input.payment', this.view).val(Currency.format(amount * -1));
    } else {
      $('input.payment', this.view).val(null);
    }
  },

  onChange: function(event) {
    if(!isNaN($(this).val())) {
      event.data.instance.notifyObservers(new Payment({form: $(this).attr('data-payment-form'), amount: Currency.toPennies(Math.abs($(this).val())) * -1}));
    } else {
      $(this).val(null);
    }
  }
});

var PaymentScaleController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    $('ul#payment_scale_container a.button').bind('click', {instance: this}, this.onScale);
  },

  onScale: function(event) {
    index = parseFloat($(this).attr('data-index'));
    event.data.instance.notifyObservers(index / 10.0);
    event.preventDefault();
  }
});

var PaymentController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],

  initialize: function(view) {
    this.callSuper();
    this.payments = [];

    this.scale_controller = new PaymentScaleController('ul#payment_scale_container');
    this.store_credit_controller = new PaymentStoreCreditController('div#payment_store_credit');
    this.gift_card_controller = new PaymentLineController('div#payment_gift_card');
    this.check_controller = new PaymentLineController('div#payment_check');
    this.credit_card_controller = new PaymentLineController('div#payment_credit_card');
    this.cash_controller = new PaymentCashController('div#payment_cash');
    this.store_credit_payout_controller = new PaymentPayoutController('li#payment_scale_store_credit');
    this.cash_payout_controller = new PaymentPayoutController('li#payment_scale_cash');
    this.store_credit_controller.addObserver(this.updatePayment, this);
    this.gift_card_controller.addObserver(this.updatePayment, this);
    this.check_controller.addObserver(this.updatePayment, this);
    this.credit_card_controller.addObserver(this.updatePayment, this);
    this.cash_controller.addObserver(this.updatePayment, this);

    this.reset();
    this.enableBuyFromStore();
  },

  reset: function() {
    this.resetSummary();
    this.resetPaymentFields();
  },

  resetSummary: function() {
    $('div#payment_summary span#payment_cart_items', this.view).html('0 item(s) in cart');
    $('div#payment_summary span#payment_cart_subtotal', this.view).html('$0.00');
    $('div#payment_summary span#payment_summary_tax', this.view).html('Tax: $0.00');
    $('div#payment_summary span#payment_summary_total', this.view).html('Total: $0.00');
    $('div#payment_action span#payment_change', this.view).html('Change Due: $0.00');
  },

  resetPaymentFields: function() {
    this.store_credit_controller.reset();
    this.gift_card_controller.reset();
    this.check_controller.reset();
    this.credit_card_controller.reset();
    this.cash_controller.reset();
    this.store_credit_payout_controller.reset();
    this.cash_payout_controller.reset();
  },

  enablePaymentFields: function() {
    this.gift_card_controller.enable();
    this.check_controller.enable();
    this.credit_card_controller.enable();
    this.cash_controller.enable();
    this.store_credit_payout_controller.disable();
    this.cash_payout_controller.disable();
  },

  disablePaymentFields: function() {
    this.store_credit_controller.disable();
    this.gift_card_controller.disable();
    this.check_controller.disable();
    this.credit_card_controller.disable();
    this.cash_controller.disable();
    this.store_credit_payout_controller.enable();
    this.cash_payout_controller.enable();
  },

  update: function(transaction) {
    this.reset();
    amount_due = transaction.amountDue();
    payments = transaction.payments();

    this.store_credit_controller.update(0, transaction.subtotal());
    this.store_credit_payout_controller.update(0, transaction.subtotal());
    this.cash_controller.update(0, amount_due);
    this.cash_payout_controller.update(0, amount_due);
    this.gift_card_controller.update(0, amount_due);
    this.credit_card_controller.update(0, amount_due);
    this.check_controller.update(0, amount_due);

    if(payments.length > 0) {
      this.payments = payments;
      for(payment in payments) {
        switch(payments[payment].form) {
          case 'store_credit':
            this.store_credit_controller.update(payments[payment].amount, transaction.subtotal());
            this.store_credit_payout_controller.update(payments[payment].amount, transaction.subtotal());
            break;
          case 'cash':
            this.cash_controller.update(payments[payment].amount, amount_due);
            this.cash_payout_controller.update(payments[payment].amount, amount_due);
            break;
          case 'gift_card':
            this.gift_card_controller.update(payments[payment].amount, amount_due);
            break;
          case 'credit_card':
            this.credit_card_controller.update(payments[payment].amount, amount_due);
            break;
          case 'check':
            this.check_controller.update(payments[payment].amount, amount_due);
            break;
        }
      }
    } else {
      this.payments = [];
    }
    this.store_credit_controller.setCustomer(transaction.customer());
    this.updateSummary(transaction);

    if(transaction.total() >= 0) {
      this.enableBuyFromStore();
    } else {
      this.enableSellToStore();
    }
  },

  updatePayment: function(updated_payment) {
    found = false;
    for(payment in this.payments) {
      if(this.payments[payment].form == updated_payment.form) {
        this.payments[payment] = updated_payment;
        found = true;
      }
    }
    if(!found) {
      this.payments.push(updated_payment);
    }
    this.notifyObservers(this.payments);
  },

  updateSummary: function(transaction) {
    amount_due = transaction.amountDue();
    $('div#payment_cart span#payment_cart_items', this.view).html(transaction.countItems() + ' item(s) in cart');
    $('div#payment_cart span#payment_cart_subtotal', this.view).html(Currency.pretty(transaction.subtotal()));
    $('div#payment_summary span#payment_summary_taxable_subtotal', this.view).html(Currency.pretty(transaction.purchaseSubtotal()));
    $('div#payment_summary span#payment_summary_tax', this.view).html('Tax: ' + Currency.pretty(transaction.tax()));
    $('div#payment_summary span#payment_summary_total', this.view).html('Total: ' + Currency.pretty(transaction.total()));
    if(amount_due >= 0) {
      $('div#payment_action span#payment_change', this.view).html('Amount Due: ' + Currency.pretty(amount_due));
    } else {
      $('div#payment_action span#payment_change', this.view).html('Change Due: ' + Currency.pretty(Math.abs(amount_due)));
    }
  },

  enableBuyFromStore: function() {
    this.enablePaymentFields();
    this.scale_controller.view.hide();
  },

  enableSellToStore: function() {
    this.disablePaymentFields();
    this.scale_controller.view.show();
  }
});
var Currency = new JS.Class({
  extend: {
    pretty: function(pennies) {
      return '$' + Currency.format(pennies);
    },

    format: function(pennies) {
      value = pennies / 100;
      return value.toFixed(2);
    },

    toPennies: function(currency) {
      return parseInt(Math.round(currency * 100));
    }
  }
});
String.prototype.ucfirst = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.capitalize = function() {
  sentence = this.split(' ');
  for(word in sentence) {
    sentence[word] = sentence[word].ucfirst();
  }
  return sentence.join(' ');
}

String.prototype.truncate = function(length) {
  return this.substr(0, length - 1) + (this.length > length? '...' : '');
}

var ReviewController = new JS.Class(ViewController, {
  include: Sectionable,

  initialize: function(view) {
    this.callSuper();
    this.payment_row = $('div#review_summary table > tbody > tr#payment', view).detach();
    this.line = $('div#review_lines table > tbody > tr', view).detach();
  },

  reset: function() {
    $('input#receipt_quantity', this.view).val(1);
    $('div#review_summary table > tbody > tr#subtotal > td', this.view).eq(1).html(Currency.pretty(0));
    $('div#review_summary table > tbody > tr#tax > td', this.view).eq(1).html(Currency.pretty(0));
    $('div#review_summary table > tbody > tr#total > td', this.view).eq(1).html(Currency.pretty(0));
    $('div#review_summary table > tbody > tr#change > td', this.view).eq(1).html(Currency.pretty(0));
    $('div#review_summary table > tbody > tr#payment', this.view).remove();
    $('div#review_lines table > tbody > tr', this.view).remove();
    $('h2#review_customer', this.view).html("No customer");
  },

  update: function(transaction) {

    customer = transaction.customer();
    if(customer != undefined) {
      person = customer.person();
      if(person != undefined) {
        $('h2#review_customer', this.view).html(person.first_name + ' ' + person.last_name);
      } else {
        $('h2#review_customer', this.view).empty();
      }
    } else {
      $('h2#review_customer', this.view).html("No customer");
    }

    $('div#review_summary table > tbody > tr#payment', this.view).remove();
    $('div#review_lines table > tbody > tr', this.view).remove();

    lines = transaction.lines();
    for(line in lines) {
      var new_line = this.line.clone();
      $('td.quantity', new_line).html(lines[line].quantity);
      $('td.title', new_line).html(lines[line].title);
      $('td.description', new_line).html(lines[line].description.truncate(50));
      $('td.subtotal', new_line).html(Currency.pretty(lines[line].subtotal()));
      $('div#review_lines table tbody').append(new_line);
    }
    payments = transaction.payments();
    for(payment in payments) {
      if(payments[payment].amount != 0) {
        var new_payment_row = this.payment_row.clone();
        $('td', new_payment_row).eq(0).html(payments[payment].form.replace('_', ' ').capitalize());
        $('td', new_payment_row).eq(1).html(Currency.pretty(payments[payment].amount));
        $('div#review_summary table tbody tr#change').before(new_payment_row);
      }
    }
    $('div#review_summary table > tbody > tr#subtotal > td', this.view).eq(1).html(Currency.pretty(transaction.subtotal()));
    $('div#review_summary table > tbody > tr#tax > td', this.view).eq(1).html(Currency.pretty(transaction.tax()));
    $('div#review_summary table > tbody > tr#total > td', this.view).eq(1).html(Currency.pretty(transaction.total()));
    amount_due = transaction.amountDue();
    if(amount_due >= 0) {
      $('div#review_summary table > tbody > tr#change > td', this.view).eq(0).html('Amount Due');
      $('div#review_summary table > tbody > tr#change > td', this.view).eq(1).html(Currency.pretty(amount_due));
    } else {
      $('div#review_summary table > tbody > tr#change > td', this.view).eq(0).html('Change Due');
      $('div#review_summary table > tbody > tr#change > td', this.view).eq(1).html(Currency.pretty(Math.abs(amount_due)));
    }
  }
});

var TransactionSummaryController = new JS.Class(ViewController, {

  reset: function() {
    this.setCustomer(new Customer());
    this.setItemCount(0);
    this.setTotal(0);
    this.view.show();
  },

  update: function(transaction) {
    customer = transaction.customer();
    if(customer != undefined) {
      this.setCustomer(customer);
    }
    this.setItemCount(transaction.countItems());
    this.setTotal(transaction.total());
  },

  setItemCount: function(count) {
    $('h2#summary_item_count', this.view).html(count + ' item(s)');
  },

  setCustomer: function(customer) {
    if(customer.id == null) {
      $('h2#summary_customer', this.view).html("No customer");
    } else {
      person = customer.person();
      if(person != undefined) {
        $('h2#summary_customer', this.view).html(person.first_name + ' ' + person.last_name);
      } else {
        $('h2#summary_customer', this.view).empty();
      }
    }
  },

  setTotal: function(total) {
    $('h2#summary_total', this.view).html(Currency.pretty(total));
  }
});

var TransactionFinishController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.enabled = false;
    $('a', view).bind('click', {instance: this}, this.finish);
  },

  reset: function() {
    this.view.show();
  },

  enable: function() {
    $('a', this.view).removeClass('disabled');
    this.enabled = true;
  },

  disable: function() {
    $('a', this.view).addClass('disabled');
    this.enabled = false;
  },

  finish: function(event) {
    if(event.data.instance.enabled) {
      event.data.instance.notifyObservers();
    }
    event.preventDefault();
  },

  update: function(transaction) {
    if(transaction.finishable()) {
      this.enable();
    } else {
      this.disable();
    }
  }
});

var TransactionNavController = new JS.Class(ViewController, {

  update: function(till) {
    $('li#transaction_nav_till', this.view).html(till.title);
    this.view.show();
  }
});

var SectionController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view, controllers) {
    this.callSuper();
    this._controllers = controllers;
    $('a', view).bind('click', {instance: this, view: this.view}, this.doClick);
  },

  doClick: function(event) {
    index = $('li > a', event.data.view).index(this);
    event.data.instance.showController(index);
    event.data.instance.notifyObservers(index);
    event.preventDefault();
  },

  showController: function(index) {
    this.hideControllers();
    this._controllers[index].show();
    $('li > a', this.view).removeClass('selected');
    $('li', this.view).eq(index).find('a').addClass('selected');
  },

  hideControllers: function() {
    for(controller in this._controllers) {
      this._controllers[controller].hide();
    }
  },

  reset: function() {
    this.view.show();
    this.showController(0);
  }
});

var TransactionController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function() {
    this.callSuper();
    this.till_id = null;
    this.user_id = null;
    this.transaction = null;

    this.transaction_nav_controller = new TransactionNavController('ul#transaction_nav');
    this.customer_controller = new CustomerController('section#customer');
    this.cart_controller = new CartController('section#cart');
    this.payment_controller = new PaymentController('section#payment');
    this.review_controller = new ReviewController('section#review');
    this.section_controller = new SectionController('ul#transactions_nav', [
      this.cart_controller,
      this.customer_controller,
      this.payment_controller,
      this.review_controller
    ]);
    this.summary_controller = new TransactionSummaryController('ul#summary');
    this.finish_controller = new TransactionFinishController('ul#finish');

    this.customer_controller.addObserver(this.updateCustomer, this);
    this.cart_controller.addObserver(this.updateCart, this);
    this.payment_controller.addObserver(this.updatePayments, this);
    this.payment_controller.scale_controller.addObserver(this.updatePayoutRatio, this);
    this.payment_controller.store_credit_payout_controller.addObserver(this.updateCreditPayout, this);
    this.payment_controller.cash_payout_controller.addObserver(this.updateCashPayout, this);
    this.finish_controller.addObserver(this.saveTransaction, this);

    $('ul#transaction_nav a.reset').bind('click', {instance: this}, this.onReset);
  },

  reset: function() {
    this.cart_controller.reset();
    this.payment_controller.reset();
    this.review_controller.reset();
    this.section_controller.reset();
    this.summary_controller.reset();
    this.finish_controller.reset();
    this.customer_controller.reset();
  },

  onReset: function(event) {
    event.data.instance.newTransaction(event.data.instance.till_id, event.data.instance.user_id);
    event.preventDefault();
  },

  updateCustomer: function(customer) {
    if(this.transaction) {
      this.transaction.setCustomer(customer);
      this.notifyControllers(this.transaction);
    }
  },

  updateCart: function(lines) {
    if(this.transaction) {
      this.transaction.setLines(lines);
      if(this.transaction.subtotal() < 0) {
        this.transaction.setPayments([new Payment({form: 'store_credit', amount: this.transaction.subtotal()})]);
      } else {
        this.transaction.setPayments([]);
      }
      this.notifyControllers(this.transaction);
    }
  },

  updatePayments: function(payments) {
    if(this.transaction) {
      this.transaction.setPayments(payments);
      this.notifyControllers(this.transaction);
    }
  },

  updatePayoutRatio: function(ratio) {
    if(this.transaction) {
      this.transaction.updatePayoutRatio(ratio);
      this.notifyControllers(this.transaction);
    }
  },

  updateCreditPayout: function(payment) {
    if(this.transaction) {
      this.transaction.updateCreditPayout(payment);
      this.notifyControllers(this.transaction);
    }
  },

  updateCashPayout: function(payment) {
    if(this.transaction) {
      this.transaction.updateCashPayout(payment);
      this.notifyControllers(this.transaction);
    }
  },

  presentReceipt: function(url) {
    this.receipt_controller.update(url);
    this.receipt_controller.show();
  },

  notifyControllers: function(transaction) {
    this.cart_controller.update(transaction);
    this.payment_controller.update(transaction);
    this.review_controller.update(transaction);
    this.summary_controller.update(transaction);
    this.finish_controller.update(transaction);
  },

  newTransaction: function(till_id, user_id) {
    this.reset();
    this.till_id = till_id;
    this.user_id = user_id;
    this.setTransaction(new Transaction({user_id: user_id, till_id: till_id, tax_rate: 0.07, complete: false, locked: false}));
  },

  setTransaction: function(transaction) {
    this.transaction = transaction;
    this.notifyControllers(transaction);
  },

  saveTransaction: function() {
    if(this.transaction.finishable() && this.transaction.save()) {
      credit_adjustment = 0;
      till_adjustment = 0;

      lines = this.transaction.lines();
      for(line in lines) {
        lines[line].transaction_id = this.transaction.id;
        if(!lines[line].save()) {
          console.error('Line not saved.');
        }
      }

      payments = this.transaction.payments();
      for(payment in payments) {
        if(payments[payment].form == 'store_credit') {
          credit_adjustment += payments[payment].amount;
        }
        if(payments[payment].form == 'cash') {
          till_adjustment += payments[payment].amount;
        }
        payments[payment].transaction_id = this.transaction.id;
        if(!payments[payment].save()) {
          console.error('Payment not saved.');
        }
      }

      if(credit_adjustment != 0) {
        customer = this.transaction.customer();
        if(customer != undefined) {
          customer.credit = customer.credit - credit_adjustment,
          if(!customer.save()) {
            console.error('Customer not saved.');
          }
        }
      }

      if(this.transaction.total() > 0) {
        till_adjustment = till_adjustment + this.transaction.amountDue();
      }
      if(till_adjustment != 0) {
        entry = new Entry({
          till_id: this.transaction.id,
          title: 'Transaction: ' + this.transaction.id,
          amount: till_adjustment
        });
        if(!entry.save()) {
          console.error('Entry not saved.');
        }
      }

      this.notifyObservers('/api/transactions/' + this.transaction.id + '/receipt');
      this.newTransaction(this.till_id, this.user_id);
    }
  }
});

var TerminalController = new JS.Class({

  initialize: function() {
    this.transaction_controller = new TransactionController('div#transaction');
    this.receipt_controller = new ReceiptController('div#receipt');
    this.till_controller = new TillController('div#till');

    this.till_controller.addObserver(this.updateTill, this);
    this.transaction_controller.addObserver(this.presentReceipt, this);

    this.reset();
  },

  reset: function() {
    this.transaction_controller.view.hide();
    this.receipt_controller.view.hide();
    this.till_controller.view.show();
  },

  presentReceipt: function(url) {
    this.receipt_controller.update(url);
    this.receipt_controller.view.show();
  },

  updateTill: function(till) {
    this.transaction_controller.newTransaction(till.id, parseInt($('ul#user_nav li.current_user_login').attr('data-user-id')));
    this.transaction_controller.transaction_nav_controller.update(till);
    this.till_controller.view.hide();
    this.transaction_controller.view.show();
  }
});

var ClockInOutController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();

    $('a.cancel', this.view).bind('click', {instance: this}, this.hideClockInOut);
    $('a.clock_in_out', this.view).bind('click', {instance: this}, this.doClockInOut);
    $('form', this.view).submit(function(event) {
      event.preventDefault();
    });
  },

  doClockInOut: function(event) {
    id = $('select#employee', event.data.instance.view).val();
    pin = $('input#pin', event.data.instance.view).val();
    employee = Employee.find(id);

    event.data.instance.validateEmployee(employee, pin, function(valid) {
      if(valid) {
        event.data.instance.timestampEmployee(employee, function(stamped) {
          event.data.instance.clearInput();
          event.data.instance.view.hide();
          event.data.instance.notifyObservers();
        });
      } else {
      }
    });
    event.preventDefault();
  },

  clearInput: function() {
    $('input#pin', this.view).val(null);
  },

  hideClockInOut: function(event) {
    event.data.instance.clearInput();
    event.data.instance.view.hide();
    event.preventDefault();
  },

  timestampEmployee: function(employee, callback) {
    if(employee.stamp()) {
      callback(true);
    } else {
      callback(false);
    }
  },

  validateEmployee: function(employee, pin, callback) {
    person = employee.person();
    if(person.user() != undefined) {
      user = person.user();

      if(user.pin == pin) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  }
});

var OverviewChartHeaderController = new JS.Class(ViewController, {

  draw: function() {
    canvas = {
      'context' : this.view[0].getContext('2d'),
      'size' : {
        'width' : this.view.innerWidth(),
        'height' : this.view.innerHeight()
      }
    }

    $(this.view).attr('width', canvas.size.width);
    $(this.view).attr('height', canvas.size.height);

    canvas.context.lineWidth = 1;
    canvas.context.font = "bold 8px sans-serif";
    canvas.context.textAlign = "center";
    canvas.context.textBaseline = "middle";

    canvas.context.clearRect(0, 0, canvas.size.width, canvas.size.height);

    canvas.context.strokeStyle = "#999999";
    canvas.context.beginPath();
    canvas.context.moveTo(0, Math.round(canvas.size.height / 2));
    canvas.context.lineTo(canvas.size.width, Math.round(canvas.size.height / 2));
    canvas.context.stroke();

    for(i = 0; i <= 48; i++) {
      x = Math.round((canvas.size.width / 48) * i);
      hour = null;

      if(i % 2 == 0) {
        y_begin = 2;
        if(i != 0 && i != 48) {
          hour = i / 2;
          if(hour > 12) {
            hour -= 12;
          }
        }
      } else {
        y_begin = 10;
      }
      y_end = canvas.size.height - y_begin;

      canvas.context.strokeStyle = "#999999";
      canvas.context.beginPath();
      canvas.context.moveTo(x, y_begin);
      canvas.context.lineTo(x, y_end);
      canvas.context.stroke();

      if(i % 2 == 0 && i != 0 && i != 48) {
        canvas.context.fillStyle = "#FFFFFF";
        canvas.context.beginPath();
        canvas.context.arc(x, Math.round(canvas.size.height / 2), 7, 0, Math.PI * 2, true);
        canvas.context.fill();
      }

      if(hour != null) {
        canvas.context.fillStyle = "#000000";
        canvas.context.fillText(hour, x, Math.round(canvas.size.height / 2));
      }
    }
  }
});

var OverviewChartController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.lines = [];

    this.overview_chart_header_controller = new OverviewChartHeaderController($('canvas.overview_chart_header', this.view));

    $('a.refresh', this.view).bind('click', {instance: this}, this.doRefresh);
  },

  update: function() {
    for(line in this.lines) {
      this.lines[line].update();
    }
    this.overview_chart_header_controller.draw();
  },

  doRefresh: function(event) {
    event.data.instance.notifyObservers();
    event.preventDefault();
  }
});

var OverviewInController = new JS.Class(OverviewChartController, {
  include: Sectionable,

  initialize: function(view) {
    this.callSuper();
    this.line = $('ul.overview_chart_in > li.overview_chart_in_item', this.view).detach();
  },

  clearLines: function() {
    $('ul.overview_chart_in > li.overview_chart_in_item', this.view).remove();
  },

  setLines: function(lines) {
    this.clearLines();
    this.lines = [];
    for(line in lines) {
      this.lines.push(lines[line]);
      $('ul.overview_chart_in', this.view).append(lines[line].view);
    }
  }
});

var OverviewOutController = new JS.Class(OverviewChartController, {
  include: Sectionable,

  initialize: function(view) {
    this.callSuper();
    this.line = $('ul.overview_chart_out > li.overview_chart_out_item', this.view).detach();
  },

  clearLines: function() {
    $('ul.overview_chart_out > li.overview_chart_out_item', this.view).remove();
  },

  setLines: function(lines) {
    this.clearLines();
    this.lines = [];
    for(line in lines) {
      this.lines.push(lines[line]);
      $('ul.overview_chart_out', this.view).append(lines[line].view);
    }
  }
});
/*
 strftime for Javascript
 Copyright (c) 2008, Philip S Tellis <philip@bluesmoon.info>
 All rights reserved.

 This code is distributed under the terms of the BSD licence

 Redistribution and use of this software in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

   * Redistributions of source code must retain the above copyright notice, this list of conditions
     and the following disclaimer.
   * Redistributions in binary form must reproduce the above copyright notice, this list of
     conditions and the following disclaimer in the documentation and/or other materials provided
     with the distribution.
   * The names of the contributors to this file may not be used to endorse or promote products
     derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * \file strftime.js
 * \author Philip S Tellis \<philip@bluesmoon.info\>
 * \version 1.3
 * \date 2008/06
 * \brief Javascript implementation of strftime
 *
 * Implements strftime for the Date object in javascript based on the PHP implementation described at
 * http://www.php.net/strftime  This is in turn based on the Open Group specification defined
 * at http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html This implementation does not
 * include modified conversion specifiers (i.e., Ex and Ox)
 *
 * The following format specifiers are supported:
 *
 * \copydoc formats
 *
 * \%a, \%A, \%b and \%B should be localised for non-English locales.
 *
 * \par Usage:
 * This library may be used as follows:
 * \code
 *     var d = new Date();
 *
 *     var ymd = d.strftime('%Y/%m/%d');
 *     var iso = d.strftime('%Y-%m-%dT%H:%M:%S%z');
 *
 * \endcode
 *
 * \sa \link Date.prototype.strftime Date.strftime \endlink for a description of each of the supported format specifiers
 * \sa Date.ext.locales for localisation information
 * \sa http://www.php.net/strftime for the PHP implementation which is the basis for this
 * \sa http://tech.bluesmoon.info/2008/04/strftime-in-javascript.html for feedback
 */

Date.ext = {};

Date.ext.util = {};

/**
\brief Left pad a number with something
\details Takes a number and pads it to the left with the passed in pad character
\param x	The number to pad
\param pad	The string to pad with
\param r	[optional] Upper limit for pad.  A value of 10 pads to 2 digits, a value of 100 pads to 3 digits.
		Default is 10.

\return The number left padded with the pad character.  This function returns a string and not a number.
*/
Date.ext.util.xPad=function(x, pad, r)
{
	if(typeof(r) == 'undefined')
	{
		r=10;
	}
	for( ; parseInt(x, 10)<r && r>1; r/=10)
		x = pad.toString() + x;
	return x.toString();
};

/**
\brief Currently selected locale.
\details
The locale for a specific date object may be changed using \code Date.locale = "new-locale"; \endcode
The default will be based on the lang attribute of the HTML tag of your document
*/
Date.prototype.locale = 'en-GB';
if(document.getElementsByTagName('html') && document.getElementsByTagName('html')[0].lang)
{
	Date.prototype.locale = document.getElementsByTagName('html')[0].lang;
}

/**
\brief Localised strings for days of the week and months of the year.
\details
To create your own local strings, add a locale object to the locales object.
The key of your object should be the same as your locale name.  For example:
   en-US,
   fr,
   fr-CH,
   de-DE
Names are case sensitive and are described at http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
Your locale object must contain the following keys:
\param a	Short names of days of week starting with Sunday
\param A	Long names days of week starting with Sunday
\param b	Short names of months of the year starting with January
\param B	Long names of months of the year starting with February
\param c	The preferred date and time representation in your locale
\param p	AM or PM in your locale
\param P	am or pm in your locale
\param x	The  preferred date representation for the current locale without the time.
\param X	The preferred time representation for the current locale without the date.

\sa Date.ext.locales.en for a sample implementation
\sa \ref localisation for detailed documentation on localising strftime for your own locale
*/
Date.ext.locales = { };

/**
 * \brief Localised strings for English (British).
 * \details
 * This will be used for any of the English dialects unless overridden by a country specific one.
 * This is the default locale if none specified
 */
Date.ext.locales.en = {
	a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	c: '%a %d %b %Y %T %Z',
	p: ['AM', 'PM'],
	P: ['am', 'pm'],
	x: '%d/%m/%y',
	X: '%T'
};

Date.ext.locales['en-US'] = Date.ext.locales.en;
Date.ext.locales['en-US'].c = '%a %d %b %Y %r %Z';
Date.ext.locales['en-US'].x = '%D';
Date.ext.locales['en-US'].X = '%r';

Date.ext.locales['en-GB'] = Date.ext.locales.en;

Date.ext.locales['en-AU'] = Date.ext.locales['en-GB'];

/**
 * \details
 * \arg \%a - abbreviated weekday name according to the current locale
 * \arg \%A - full weekday name according to the current locale
 * \arg \%b - abbreviated month name according to the current locale
 * \arg \%B - full month name according to the current locale
 * \arg \%c - preferred date and time representation for the current locale
 * \arg \%C - century number (the year divided by 100 and truncated to an integer, range 00 to 99)
 * \arg \%d - day of the month as a decimal number (range 01 to 31)
 * \arg \%D - same as %m/%d/%y
 * \arg \%e - day of the month as a decimal number, a single digit is preceded by a space (range ' 1' to '31')
 * \arg \%g - like %G, but without the century
 * \arg \%G - The 4-digit year corresponding to the ISO week number
 * \arg \%h - same as %b
 * \arg \%H - hour as a decimal number using a 24-hour clock (range 00 to 23)
 * \arg \%I - hour as a decimal number using a 12-hour clock (range 01 to 12)
 * \arg \%j - day of the year as a decimal number (range 001 to 366)
 * \arg \%m - month as a decimal number (range 01 to 12)
 * \arg \%M - minute as a decimal number
 * \arg \%n - newline character
 * \arg \%p - either `AM' or `PM' according to the given time value, or the corresponding strings for the current locale
 * \arg \%P - like %p, but lower case
 * \arg \%r - time in a.m. and p.m. notation equal to %I:%M:%S %p
 * \arg \%R - time in 24 hour notation equal to %H:%M
 * \arg \%S - second as a decimal number
 * \arg \%t - tab character
 * \arg \%T - current time, equal to %H:%M:%S
 * \arg \%u - weekday as a decimal number [1,7], with 1 representing Monday
 * \arg \%U - week number of the current year as a decimal number, starting with
 *            the first Sunday as the first day of the first week
 * \arg \%V - The ISO 8601:1988 week number of the current year as a decimal number,
 *            range 01 to 53, where week 1 is the first week that has at least 4 days
 *            in the current year, and with Monday as the first day of the week.
 * \arg \%w - day of the week as a decimal, Sunday being 0
 * \arg \%W - week number of the current year as a decimal number, starting with the
 *            first Monday as the first day of the first week
 * \arg \%x - preferred date representation for the current locale without the time
 * \arg \%X - preferred time representation for the current locale without the date
 * \arg \%y - year as a decimal number without a century (range 00 to 99)
 * \arg \%Y - year as a decimal number including the century
 * \arg \%z - numerical time zone representation
 * \arg \%Z - time zone name or abbreviation
 * \arg \%% - a literal `\%' character
 */
Date.ext.formats = {
	a: function(d) { return Date.ext.locales[d.locale].a[d.getDay()]; },
	A: function(d) { return Date.ext.locales[d.locale].A[d.getDay()]; },
	b: function(d) { return Date.ext.locales[d.locale].b[d.getMonth()]; },
	B: function(d) { return Date.ext.locales[d.locale].B[d.getMonth()]; },
	c: 'toLocaleString',
	C: function(d) { return Date.ext.util.xPad(parseInt(d.getFullYear()/100, 10), 0); },
	d: ['getDate', '0'],
	e: ['getDate', ' '],
	g: function(d) { return Date.ext.util.xPad(parseInt(Date.ext.util.G(d)/100, 10), 0); },
	G: function(d) {
			var y = d.getFullYear();
			var V = parseInt(Date.ext.formats.V(d), 10);
			var W = parseInt(Date.ext.formats.W(d), 10);

			if(W > V) {
				y++;
			} else if(W===0 && V>=52) {
				y--;
			}

			return y;
		},
	H: ['getHours', '0'],
	I: function(d) { var I=d.getHours()%12; return Date.ext.util.xPad(I===0?12:I, 0); },
	j: function(d) {
			var ms = d - new Date('' + d.getFullYear() + '/1/1 GMT');
			ms += d.getTimezoneOffset()*60000;
			var doy = parseInt(ms/60000/60/24, 10)+1;
			return Date.ext.util.xPad(doy, 0, 100);
		},
	m: function(d) { return Date.ext.util.xPad(d.getMonth()+1, 0); },
	M: ['getMinutes', '0'],
	p: function(d) { return Date.ext.locales[d.locale].p[d.getHours() >= 12 ? 1 : 0 ]; },
	P: function(d) { return Date.ext.locales[d.locale].P[d.getHours() >= 12 ? 1 : 0 ]; },
	S: ['getSeconds', '0'],
	u: function(d) { var dow = d.getDay(); return dow===0?7:dow; },
	U: function(d) {
			var doy = parseInt(Date.ext.formats.j(d), 10);
			var rdow = 6-d.getDay();
			var woy = parseInt((doy+rdow)/7, 10);
			return Date.ext.util.xPad(woy, 0);
		},
	V: function(d) {
			var woy = parseInt(Date.ext.formats.W(d), 10);
			var dow1_1 = (new Date('' + d.getFullYear() + '/1/1')).getDay();
			var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
			if(idow == 53 && (new Date('' + d.getFullYear() + '/12/31')).getDay() < 4)
			{
				idow = 1;
			}
			else if(idow === 0)
			{
				idow = Date.ext.formats.V(new Date('' + (d.getFullYear()-1) + '/12/31'));
			}

			return Date.ext.util.xPad(idow, 0);
		},
	w: 'getDay',
	W: function(d) {
			var doy = parseInt(Date.ext.formats.j(d), 10);
			var rdow = 7-Date.ext.formats.u(d);
			var woy = parseInt((doy+rdow)/7, 10);
			return Date.ext.util.xPad(woy, 0, 10);
		},
	y: function(d) { return Date.ext.util.xPad(d.getFullYear()%100, 0); },
	Y: 'getFullYear',
	z: function(d) {
			var o = d.getTimezoneOffset();
			var H = Date.ext.util.xPad(parseInt(Math.abs(o/60), 10), 0);
			var M = Date.ext.util.xPad(o%60, 0);
			return (o>0?'-':'+') + H + M;
		},
	Z: function(d) { return d.toString().replace(/^.*\(([^)]+)\)$/, '$1'); },
	'%': function(d) { return '%'; }
};

/**
\brief List of aggregate format specifiers.
\details
Aggregate format specifiers map to a combination of basic format specifiers.
These are implemented in terms of Date.ext.formats.

A format specifier that maps to 'locale' is read from Date.ext.locales[current-locale].

\sa Date.ext.formats
*/
Date.ext.aggregates = {
	c: 'locale',
	D: '%m/%d/%y',
	h: '%b',
	n: '\n',
	r: '%I:%M:%S %p',
	R: '%H:%M',
	t: '\t',
	T: '%H:%M:%S',
	x: 'locale',
	X: 'locale'
};

Date.ext.aggregates.z = Date.ext.formats.z(new Date());
Date.ext.aggregates.Z = Date.ext.formats.Z(new Date());

/**
 * \details
 * All format specifiers supported by the PHP implementation are supported by
 * this javascript implementation.
 */
Date.ext.unsupported = { };


/**
 * \brief Formats the date according to the specified format.
 * \param fmt	The format to format the date in.  This may be a combination of the following:
 * \copydoc formats
 *
 * \return	A string representation of the date formatted based on the passed in parameter
 * \sa http://www.php.net/strftime for documentation on format specifiers
*/
Date.prototype.strftime=function(fmt)
{
	if(!(this.locale in Date.ext.locales))
	{
		if(this.locale.replace(/-[a-zA-Z]+$/, '') in Date.ext.locales)
		{
			this.locale = this.locale.replace(/-[a-zA-Z]+$/, '');
		}
		else
		{
			this.locale = 'en-GB';
		}
	}

	var d = this;
	while(fmt.match(/%[cDhnrRtTxXzZ]/))
	{
		fmt = fmt.replace(/%([cDhnrRtTxXzZ])/g, function(m0, m1)
				{
					var f = Date.ext.aggregates[m1];
					return (f == 'locale' ? Date.ext.locales[d.locale][m1] : f);
				});
	}


	var str = fmt.replace(/%([aAbBCdegGHIjmMpPSuUVwWyY%])/g, function(m0, m1)
			{
				var f = Date.ext.formats[m1];
				if(typeof(f) == 'string') {
					return d[f]();
				} else if(typeof(f) == 'function') {
					return f.call(d, d);
				} else if(typeof(f) == 'object' && typeof(f[0]) == 'string') {
					return Date.ext.util.xPad(d[f[0]](), f[1]);
				} else {
					return m1;
				}
			});
	d=null;
	return str;
};

/**
 * \mainpage strftime for Javascript
 *
 * \section toc Table of Contents
 * - \ref intro_sec
 * - <a class="el" href="strftime.js">Download full source</a> / <a class="el" href="strftime-min.js">minified</a>
 * - \subpage usage
 * - \subpage format_specifiers
 * - \subpage localisation
 * - \link strftime.js API Documentation \endlink
 * - \subpage demo
 * - \subpage changelog
 * - \subpage faq
 * - <a class="el" href="http://tech.bluesmoon.info/2008/04/strftime-in-javascript.html">Feedback</a>
 * - \subpage copyright_licence
 *
 * \section intro_sec Introduction
 *
 * C and PHP developers have had access to a built in strftime function for a long time.
 * This function is an easy way to format dates and times for various display needs.
 *
 * This library brings the flexibility of strftime to the javascript Date object
 *
 * Use this library if you frequently need to format dates in javascript in a variety of ways.  For example,
 * if you have PHP code that writes out formatted dates, and want to mimic the functionality using
 * progressively enhanced javascript, then this library can do exactly what you want.
 *
 *
 *
 *
 * \page usage Example usage
 *
 * \section usage_sec Usage
 * This library may be used as follows:
 * \code
 *     var d = new Date();
 *
 *     var ymd = d.strftime('%Y/%m/%d');
 *     var iso = d.strftime('%Y-%m-%dT%H:%M:%S%z');
 *
 * \endcode
 *
 * \subsection examples Examples
 *
 * To get the current time in hours and minutes:
 * \code
 * 	var d = new Date();
 * 	d.strftime("%H:%M");
 * \endcode
 *
 * To get the current time with seconds in AM/PM notation:
 * \code
 * 	var d = new Date();
 * 	d.strftime("%r");
 * \endcode
 *
 * To get the year and day of the year for August 23, 2009:
 * \code
 * 	var d = new Date('2009/8/23');
 * 	d.strftime("%Y-%j");
 * \endcode
 *
 * \section demo_sec Demo
 *
 * Try your own examples on the \subpage demo page.  You can use any of the supported
 * \subpage format_specifiers.
 *
 *
 *
 *
 * \page localisation Localisation
 * You can localise strftime by implementing the short and long forms for days of the
 * week and months of the year, and the localised aggregates for the preferred date
 * and time representation for your locale.  You need to add your locale to the
 * Date.ext.locales object.
 *
 * \section localising_fr Localising for french
 *
 * For example, this is how we'd add French language strings to the locales object:
 * \dontinclude index.html
 * \skip Generic french
 * \until };
 * The % format specifiers are all defined in \ref formats.  You can use any of those.
 *
 * This locale definition may be included in your own source file, or in the HTML file
 * including \c strftime.js, however it must be defined \em after including \c strftime.js
 *
 * The above definition includes generic french strings and formats that are used in France.
 * Other french speaking countries may have other representations for dates and times, so we
 * need to override this for them.  For example, Canadian french uses a Y-m-d date format,
 * while French french uses d.m.Y.  We fix this by defining Canadian french to be the same
 * as generic french, and then override the format specifiers for \c x for the \c fr-CA locale:
 * \until End french
 *
 * You can now use any of the French locales at any time by setting \link Date.prototype.locale Date.locale \endlink
 * to \c "fr", \c "fr-FR", \c "fr-CA", or any other french dialect:
 * \code
 *     var d = new Date("2008/04/22");
 *     d.locale = "fr";
 *
 *     d.strftime("%A, %d %B == %x");
 * \endcode
 * will return:
 * \code
 *     mardi, 22 avril == 22.04.2008
 * \endcode
 * While changing the locale to "fr-CA":
 * \code
 *     d.locale = "fr-CA";
 *
 *     d.strftime("%A, %d %B == %x");
 * \endcode
 * will return:
 * \code
 *     mardi, 22 avril == 2008-04-22
 * \endcode
 *
 * You can use any of the format specifiers defined at \ref formats
 *
 * The locale for all dates defaults to the value of the \c lang attribute of your HTML document if
 * it is set, or to \c "en" otherwise.
 * \note
 * Your locale definitions \b MUST be added to the locale object before calling
 * \link Date.prototype.strftime Date.strftime \endlink.
 *
 * \sa \ref formats for a list of format specifiers that can be used in your definitions
 * for c, x and X.
 *
 * \section locale_names Locale names
 *
 * Locale names are defined in RFC 1766. Typically, a locale would be a two letter ISO639
 * defined language code and an optional ISO3166 defined country code separated by a -
 *
 * eg: fr-FR, de-DE, hi-IN
 *
 * \sa http://www.ietf.org/rfc/rfc1766.txt
 * \sa http://www.loc.gov/standards/iso639-2/php/code_list.php
 * \sa http://www.iso.org/iso/country_codes/iso_3166_code_lists/english_country_names_and_code_elements.htm
 *
 * \section locale_fallback Locale fallbacks
 *
 * If a locale object corresponding to the fully specified locale isn't found, an attempt will be made
 * to fall back to the two letter language code.  If a locale object corresponding to that isn't found
 * either, then the locale will fall back to \c "en".  No warning will be issued.
 *
 * For example, if we define a locale for de:
 * \until };
 * Then set the locale to \c "de-DE":
 * \code
 *     d.locale = "de-DE";
 *
 *     d.strftime("%a, %d %b");
 * \endcode
 * In this case, the \c "de" locale will be used since \c "de-DE" has not been defined:
 * \code
 *     Di, 22 Apr
 * \endcode
 *
 * Swiss german will return the same since it will also fall back to \c "de":
 * \code
 *     d.locale = "de-CH";
 *
 *     d.strftime("%a, %d %b");
 * \endcode
 * \code
 *     Di, 22 Apr
 * \endcode
 *
 * We need to override the \c a specifier for Swiss german, since it's different from German german:
 * \until End german
 * We now get the correct results:
 * \code
 *     d.locale = "de-CH";
 *
 *     d.strftime("%a, %d %b");
 * \endcode
 * \code
 *     Die, 22 Apr
 * \endcode
 *
 * \section builtin_locales Built in locales
 *
 * This library comes with pre-defined locales for en, en-GB, en-US and en-AU.
 *
 *
 *
 *
 * \page format_specifiers Format specifiers
 *
 * \section specifiers Format specifiers
 * strftime has several format specifiers defined by the Open group at
 * http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html
 *
 * PHP added a few of its own, defined at http://www.php.net/strftime
 *
 * This javascript implementation supports all the PHP specifiers
 *
 * \subsection supp Supported format specifiers:
 * \copydoc formats
 *
 * \subsection unsupportedformats Unsupported format specifiers:
 * \copydoc unsupported
 *
 *
 *
 *
 * \page demo strftime demo
 * <div style="float:right;width:45%;">
 * \copydoc formats
 * </div>
 * \htmlinclude index.html
 *
 *
 *
 *
 * \page faq FAQ
 *
 * \section how_tos Usage
 *
 * \subsection howtouse Is there a manual on how to use this library?
 *
 * Yes, see \ref usage
 *
 * \subsection wheretoget Where can I get a minified version of this library?
 *
 * The minified version is available <a href="strftime-min.js" title="Minified strftime.js">here</a>.
 *
 * \subsection which_specifiers Which format specifiers are supported?
 *
 * See \ref format_specifiers
 *
 * \section whys Why?
 *
 * \subsection why_lib Why this library?
 *
 * I've used the strftime function in C, PHP and the Unix shell, and found it very useful
 * to do date formatting.  When I needed to do date formatting in javascript, I decided
 * that it made the most sense to just reuse what I'm already familiar with.
 *
 * \subsection why_another Why another strftime implementation for Javascript?
 *
 * Yes, there are other strftime implementations for Javascript, but I saw problems with
 * all of them that meant I couldn't use them directly.  Some implementations had bad
 * designs.  For example, iterating through all possible specifiers and scanning the string
 * for them.  Others were tied to specific libraries like prototype.
 *
 * Trying to extend any of the existing implementations would have required only slightly
 * less effort than writing this from scratch.  In the end it took me just about 3 hours
 * to write the code and about 6 hours battling with doxygen to write these docs.
 *
 * I also had an idea of how I wanted to implement this, so decided to try it.
 *
 * \subsection why_extend_date Why extend the Date class rather than subclass it?
 *
 * I tried subclassing Date and failed.  I didn't want to waste time on figuring
 * out if there was a problem in my code or if it just wasn't possible.  Adding to the
 * Date.prototype worked well, so I stuck with it.
 *
 * I did have some worries because of the way for..in loops got messed up after json.js added
 * to the Object.prototype, but that isn't an issue here since {} is not a subclass of Date.
 *
 * My last doubt was about the Date.ext namespace that I created.  I still don't like this,
 * but I felt that \c ext at least makes clear that this is external or an extension.
 *
 * It's quite possible that some future version of javascript will add an \c ext or a \c locale
 * or a \c strftime property/method to the Date class, but this library should probably
 * check for capabilities before doing what it does.
 *
 * \section curiosity Curiosity
 *
 * \subsection how_big How big is the code?
 *
 * \arg 26K bytes with documentation
 * \arg 4242 bytes minified using <a href="http://developer.yahoo.com/yui/compressor/">YUI Compressor</a>
 * \arg 1477 bytes minified and gzipped
 *
 * \subsection how_long How long did it take to write this?
 *
 * 15 minutes for the idea while I was composing this blog post:
 * http://tech.bluesmoon.info/2008/04/javascript-date-functions.html
 *
 * 3 hours in one evening to write v1.0 of the code and 6 hours the same
 * night to write the docs and this manual.  As you can tell, I'm fairly
 * sleepy.
 *
 * Versions 1.1 and 1.2 were done in a couple of hours each, and version 1.3
 * in under one hour.
 *
 * \section contributing Contributing
 *
 * \subsection how_to_rfe How can I request features or make suggestions?
 *
 * You can leave a comment on my blog post about this library here:
 * http://tech.bluesmoon.info/2008/04/strftime-in-javascript.html
 *
 * \subsection how_to_contribute Can I/How can I contribute code to this library?
 *
 * Yes, that would be very nice, thank you.  You can do various things.  You can make changes
 * to the library, and make a diff against the current file and mail me that diff at
 * philip@bluesmoon.info, or you could just host the new file on your own servers and add
 * your name to the copyright list at the top stating which parts you've added.
 *
 * If you do mail me a diff, let me know how you'd like to be listed in the copyright section.
 *
 * \subsection copyright_signover Who owns the copyright on contributed code?
 *
 * The contributor retains copyright on contributed code.
 *
 * In some cases I may use contributed code as a template and write the code myself.  In this
 * case I'll give the contributor credit for the idea, but will not add their name to the
 * copyright holders list.
 *
 *
 *
 *
 * \page copyright_licence Copyright & Licence
 *
 * \section copyright Copyright
 * \dontinclude strftime.js
 * \skip Copyright
 * \until rights
 *
 * \section licence Licence
 * \skip This code
 * \until SUCH DAMAGE.
 *
 *
 *
 * \page changelog ChangeLog
 *
 * \par 1.3 - 2008/06/17:
 * - Fixed padding issue with negative timezone offsets in %r
 *   reported and fixed by Mikko <mikko.heimola@iki.fi>
 * - Added support for %P
 * - Internationalised %r, %p and %P
 *
 * \par 1.2 - 2008/04/27:
 * - Fixed support for c (previously it just returned toLocaleString())
 * - Add support for c, x and X
 * - Add locales for en-GB, en-US and en-AU
 * - Make en-GB the default locale (previous was en)
 * - Added more localisation docs
 *
 * \par 1.1 - 2008/04/27:
 * - Fix bug in xPad which wasn't padding more than a single digit
 * - Fix bug in j which had an off by one error for days after March 10th because of daylight savings
 * - Add support for g, G, U, V and W
 *
 * \par 1.0 - 2008/04/22:
 * - Initial release with support for a, A, b, B, c, C, d, D, e, H, I, j, m, M, p, r, R, S, t, T, u, w, y, Y, z, Z, and %
 */

Date.prototype.setISO8601 = function(dString){

  var regexp = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;

  if (dString.toString().match(new RegExp(regexp))) {
    var d = dString.match(new RegExp(regexp));
    var offset = 0;

    this.setUTCDate(1);
    this.setUTCFullYear(parseInt(d[1],10));
    this.setUTCMonth(parseInt(d[3],10) - 1);
    this.setUTCDate(parseInt(d[5],10));
    this.setUTCHours(parseInt(d[7],10));
    this.setUTCMinutes(parseInt(d[9],10));
    this.setUTCSeconds(parseInt(d[11],10));
    if (d[12]) {
      this.setUTCMilliseconds(parseFloat(d[12]) * 1000);
    } else {
      this.setUTCMilliseconds(0);
    }
    if (d[13] != 'Z') {
      offset = (d[15] * 60) + parseInt(d[17],10);
      offset *= ((d[14] == '-') ? -1 : 1);
      this.setTime(this.getTime() - offset * 60 * 1000);
    }
  } else {
    this.setTime(Date.parse(dString));
  }
  return this;
};

var OverviewChartCanvasController = new JS.Class(ViewController, {

  initialize: function(view, timecards) {
    this.callSuper();
    this.timecards = timecards;
  },

  draw: function() {
    now = new Date();
    canvas = {
      'context' : this.view[0].getContext('2d'),
      'size' : {
        'width' : this.view.innerWidth(),
        'height' : this.view.innerHeight()
      }
    }
    today = {
      now: now.getTime(),
      begin: new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(),
      end: (new Date(now.getFullYear(), now.getMonth(), now.getDate(), 24)).getTime()
    }

    $(this.view).attr('width', canvas.size.width);
    $(this.view).attr('height', canvas.size.height);
    canvas.context.fillStyle = this.view.css('color');
    canvas.context.clearRect(0,0,canvas.size.width,canvas.size.height);

    for(timecard in this.timecards) {
      begin = (new Date()).setISO8601(this.timecards[timecard].begin).getTime();
      if(this.timecards[timecard].end != null) {
        end = (new Date()).setISO8601(this.timecards[timecard].end).getTime();
      } else {
        end = new Date().getTime();
      }
      x = Math.round(((begin - today.begin) / (today.end - today.begin)) * canvas.size.width);
      width = Math.round(((end - today.begin) / (today.end - today.begin)) * canvas.size.width) - x;
      canvas.context.fillRect(x,0,width,canvas.size.height);
    }
  }
});

var OverviewChartLineController = new JS.Class(ViewController, {

  initialize: function(view, employee) {
    this.callSuper();
    this.canvas = new OverviewChartCanvasController($('canvas', this.view), employee.timecards());
    this.setName(employee.person());
  },

  update: function() {
    this.canvas.draw();
  },

  setName: function(person) {
    $('h3', this.view).html(person.first_name + ' ' + person.last_name);
  }
});

var OverviewController = new JS.Class(ViewController, {
  include: Sectionable,

  initialize: function(view) {
    this.callSuper();

    this.clock_in_out_controller = new ClockInOutController('div#clock_in_out');
    this.overview_in_controller = new OverviewInController('div#overview_in');
    this.overview_out_controller = new OverviewOutController('div#overview_out');
    this.overview_section_controller = new SectionController('ul#overview_nav', [
      this.overview_in_controller,
      this.overview_out_controller
    ]);
    this.reset();

    this.overview_section_controller.addObserver(this.updateCanvas, this);
    this.overview_in_controller.addObserver(this.updateCharts, this);
    this.overview_out_controller.addObserver(this.updateCharts, this);
    this.clock_in_out_controller.addObserver(this.updateCharts, this);

    var controller = this;
    this.clock_interval = window.setInterval(function() {
      controller.updateClock();
    }, 1000);
    this.canvas_interval = window.setInterval(function() {
      controller.updateCanvas();
    }, 60000);

    $('a.clock_in_out', this.view).bind('click', {instance: this}, this.showClockInOut);
  },

  reset: function() {
    this.overview_in_controller.clearLines();
    this.overview_out_controller.clearLines();
    this.showInController();
  },

  show: function() {
    this.callSuper();
    this.updateCharts();
  },

  showInController: function() {
    this.overview_section_controller.showController(0);
  },

  showOutController: function() {
    this.overview_section_controller.showController(1);
  },

  showClockInOut: function(event) {
    event.data.instance.clock_in_out_controller.view.show();
    event.preventDefault();
  },

  findEmployees: function() {
    day_begin = new Date();
    day_end = new Date();
    day_end.setDate(day_begin.getDate() + 1);
    timecards = Timecard.where('begin >= ? AND begin <= ?', [day_begin.strftime('%Y-%m-%d 05:00:00'), day_end.strftime('%Y-%m-%d 04:59:59')]);
    employees_in = [];
    employees_out = [];
    employees = [];
    for(timecard in timecards) {
      timecard_employee = null;
      for(employee in employees) {
        if(timecards[timecard].employee_id == employees[employee].id) {
          timecard_employee = employees[employee];
        }
      }
      if(timecard_employee == null) {
        if(timecards[timecard].employee_id != null) {
          timecard_employee = Employee.find(timecards[timecard].employee_id);
          timecard_employee._timecards_loaded = true;
          employees.push(timecard_employee);
        }
      }
      if(timecard_employee != null) {
        timecard_employee.addTimecard(timecards[timecard]);
      }
    }
    for(employee in employees) {
      null_found = false;
      timecards = employees[employee].timecards();
      for(timecard in timecards) {
        if(timecards[timecard].end == null) {
          null_found = true;
        }
      }
      if(null_found) {
        employees_in.push(employees[employee]);
      } else {
        employees_out.push(employees[employee]);
      }
    }
    return { employees_in: employees_in, employees_out: employees_out }
  },

  updateCharts: function() {
    employees_in_lines = [];
    employees_out_lines = [];
    employees = this.findEmployees();
    for(employee in employees.employees_in) {
      employees_in_lines.push(new OverviewChartLineController(this.overview_in_controller.line.clone(), employees.employees_in[employee]));
    }
    for(employee in employees.employees_out) {
      employees_out_lines.push(new OverviewChartLineController(this.overview_out_controller.line.clone(), employees.employees_out[employee]));
    }
    this.overview_in_controller.setLines(employees_in_lines);
    this.overview_out_controller.setLines(employees_out_lines);
    this.updateCanvas();
  },

  updateCanvas: function() {
    this.overview_in_controller.update();
    this.overview_out_controller.update();
  },

  updateClock: function() {
    $('h2#overview_datetime', this.view).html(new Date().strftime('%A %B %d %Y %I:%M:%S %P'));
  }
});

var DateController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.reset();

    $('a.prev', this.view).bind('click', {instance: this}, this.onPrev);
    $('a.next', this.view).bind('click', {instance: this}, this.onNext);
    $('a.today', this.view).bind('click', {instance: this}, this.onToday);
    $('select', this.view).bind('change', {instance: this}, this.onDate);
  },

  update: function(date) {
    this.date = date;
    $('select#date_year option[value=' + this.date.getFullYear() + ']', this.view).attr('selected', 'selected');
    $('select#date_month option[value=' + (this.date.getMonth() + 1) + ']', this.view).attr('selected', 'selected');
    $('select#date_day option[value=' + this.date.getDate() + ']', this.view).attr('selected', 'selected');
  },

  reset: function() {
    this.update(new Date());
  },

  onPrev: function(event) {
    event.data.instance.update(new Date(event.data.instance.date.valueOf() - (60 * 60 * 24 * 1000)));
    event.data.instance.notifyObservers(event.data.instance.date);
    event.preventDefault();
  },

  onNext: function(event) {
    event.data.instance.update(new Date(event.data.instance.date.valueOf() + (60 * 60 * 24 * 1000)));
    event.data.instance.notifyObservers(event.data.instance.date);
    event.preventDefault();
  },

  onToday: function(event) {
    event.data.instance.update(new Date());
    event.data.instance.notifyObservers(event.data.instance.date);
    event.preventDefault();
  },

  onDate: function(event) {
    year = $('select#date_year', event.data.instance.view).val();
    month = $('select#date_month', event.data.instance.view).val();
    day = $('select#date_day', event.data.instance.view).val();
    event.data.instance.update(new Date(year, month - 1, day));
    event.data.instance.notifyObservers(event.data.instance.date);
    event.preventDefault();
  }
});

var AdminEmployeeController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();

    $('select', this.view).bind('change', {instance: this}, this.onEmployee);
  },

  onEmployee: function(event) {
    id = parseInt($('select', this.view).val());
    if(!isNaN(id)) {
      event.data.instance.notifyObservers(Employee.find(id));
    }
    event.preventDefault();
  }
});

var AdminTimecardsTimecardController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.timecard = null;

    $('a.delete', this.view).bind('click', {instance: this}, this.onDelete);
    $('a.edit', this.view).bind('click', {instance: this}, this.onEdit);
  },

  set: function(timecard) {
    this.timecard = timecard;
    begin = (new Date()).setISO8601(this.timecard.begin);
    end = (new Date()).setISO8601(this.timecard.end);
    total = ((end.valueOf() - begin.valueOf()) / 3600000).toFixed(2);

    $('h3.timecards_line_total', this.view).html(total + ' hours');
    $('h4.timecards_line_time', this.view).html(begin.toString() + ' - ' + end.toString());
  },

  onDelete: function(event) {
    event.data.instance.timecard.destroy();
    event.data.instance.notifyObservers(undefined);
    event.preventDefault();
  },

  onEdit: function(event) {
    event.data.instance.notifyObservers(event.data.instance.timecard);
    event.preventDefault();
  }
});

var AdminTimecardsController = new JS.Class(ViewController, {
  include: Sectionable,

  initialize: function(view) {
    this.callSuper();
    this.date = null;
    this.employee = null;
    this.timecards = [];
    this.timecard_controllers = [];
    this.timecard = $('li.timecards_line', this.view).detach();

    this.timecard_controller = new TimecardController('div#timecard');
    this.timecard_controller.addObserver(this.loadTimecards, this);

    $('a.add', this.view).bind('click', {instance: this}, this.onAdd);
  },

  reset: function() {
    this.date = null;
    this.employee = null;
    this.timecards = [];
    this.timecard_controllers = [];
    this.clearTimecards();
  },

  update: function(date, employee) {
    this.date = date;
    this.employee = employee;
    this.loadTimecards();
  },

  loadTimecards: function() {
    tomorrow = new Date();
    tomorrow.setDate(this.date.getDate() + 1);
    this.setTimecards(Timecard.where('employee_id = ? AND begin >= ? AND begin <= ? AND end IS NOT NULL', [this.employee.id, this.date.strftime('%Y-%m-%d 05:00:00'), tomorrow.strftime('%Y-%m-%d 04:59:59')]));
  },

  clearTimecards: function() {
    $('ul#timecards_lines > li').remove();
  },

  setTimecards: function(timecards) {
    this.clearTimecards();
    this.setTimecardsTotal(timecards);
    this.timecard_controllers = [];
    for(timecard in timecards) {
      new_timecard = new AdminTimecardsTimecardController(this.timecard.clone());
      new_timecard.set(timecards[timecard]);
      new_timecard.addObserver(this.updateTimecard, this);
      this.timecard_controllers.push(new_timecard);
      $('ul#timecards_lines', this.view).append(new_timecard.view);
    }
    if(timecards.length > 0) {
      this.hideNotice();
    } else {
      this.showNotice();
    }
  },

  setTimecardsTotal: function(timecards) {
    total = 0;
    for(timecard in timecards) {
      begin = (new Date()).setISO8601(timecards[timecard].begin);
      end = (new Date()).setISO8601(timecards[timecard].end);
      total += (end.valueOf() - begin.valueOf()) / 3600000
    }
    $('h3#timecards_total').html(total.toFixed(2) + ' hours');
  },

  updateTimecard: function(timecard) {
    if(timecard != undefined) {
      this.timecard_controller.setEmployee(this.employee);
      this.timecard_controller.setTimecard(timecard);
      this.timecard_controller.view.show();
    } else {
      this.loadTimecards();
    }
  },

  onAdd: function(event) {
    event.data.instance.timecard_controller.setEmployee(event.data.instance.employee);
    event.data.instance.timecard_controller.setTimecard(null);
    event.data.instance.timecard_controller.view.show();
    event.preventDefault();
  },

  showNotice: function() {
    $('h2#timecards_notice', this.view).show();
  },

  hideNotice: function() {
    $('h2#timecards_notice', this.view).hide();
  }
});

var AdminController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],

  initialize: function(view) {
    this.callSuper();
    this.employee = null;
    this.date = new Date();

    this.admin_date_controller = new DateController('form#admin_date');
    this.admin_employee_controller = new AdminEmployeeController('form#admin_employee');
    this.admin_timecards_controller = new AdminTimecardsController('div#admin_timecards');
    this.admin_section_controller = new SectionController('ul#admin_nav', [
      this.admin_timecards_controller
    ]);

    this.admin_date_controller.addObserver(this.updateDate, this);
    this.admin_employee_controller.addObserver(this.updateEmployee, this);
  },

  reset: function() {
    this.admin_date_controller.reset();
    this.admin_timecards_controller.reset();
    $('select', this.admin_employee_controller.view).trigger('change');
  },

  show: function() {
    this.callSuper();
    this.updateTimecards(this.date, this.employee);
  },

  updateDate: function(date) {
    this.date = date;
    this.updateTimecards(this.date, this.employee);
  },

  updateEmployee: function(employee) {
    this.employee = employee;
    this.updateTimecards(this.date, this.employee);
  },

  updateTimecards: function(date, employee) {
    this.admin_timecards_controller.update(date, employee);
  }
});

var TimeclockController = new JS.Class({

  initialize: function() {
    this.overview_controller = new OverviewController('section#overview');
    this.admin_controller = new AdminController('section#admin');
    this.section_controller = new SectionController('ul#timeclock_nav', [
      this.overview_controller,
      this.admin_controller
    ]);
    this.reset();

    this.overview_controller.updateClock();
    this.overview_controller.updateCanvas();
    this.overview_controller.updateCharts();
  },

  reset: function() {
    this.overview_controller.reset();
    this.admin_controller.reset();
    this.section_controller.reset();
  }
});

var EditFormController = new JS.Class(FormController, {

  update: function(user) {
    this.reset();

    $('input#id', this.view).val(user.id);
    $('input#login', this.view).val(user.login);
    $('input#pin', this.view).val(user.pin);
    $('input#administrator', this.view).attr('checked', user.administrator);
    $('input#active', this.view).attr('checked', user.active);

    person = user.person();
    if(person != undefined) {
      $('input#first_name', this.view).val(person.first_name);
      $('input#last_name', this.view).val(person.last_name);
      $('input#middle_name', this.view).val(person.middle_name);
      if(person.date_of_birth != null) {
        date_of_birth = (new Date()).setISO8601(person.date_of_birth);
        $('select#date_of_birth_year', this.view).val(date_of_birth.getFullYear());
        $('select#date_of_birth_month', this.view).val(date_of_birth.getMonth() + 1);
        $('select#date_of_birth_day', this.view).val(date_of_birth.getDate());
      }

      addresses = person.addresses();
      if(addresses.length > 0) {
        $('input#first_line', this.view).val(addresses[0].first_line);
        $('input#second_line', this.view).val(addresses[0].second_line);
        $('input#city', this.view).val(addresses[0].city);
        $('input#state', this.view).val(addresses[0].state);
        $('input#zip', this.view).val(addresses[0].zip);
      }

      phones = person.phones();
      if(phones.length > 0){
        $('input#number', this.view).val(phones[0].number);
      }

      emails = person.emails();
      if(emails.length > 0){
        $('input#address', this.view).val(emails[0].address);
      }

      employee = person.employee();
      if(employee != undefined) {
        $('input#job_title', this.view).val(employee.title);
        $('input#rate', this.view).val(Currency.format(employee.rate));
      }
    }
  },

  save: function() {
    if(this.valid()) {
      if($('input#id', this.view).val() > 0) {
        user = User.find($('input#id', this.view).val());
        user.login = $('input#login', this.view).val();
        user.pin = $('input#pin', this.view).val();
        user.email = $('input#address', this.view).val();
        if($('input#password', this.view).val() != '') {
          user.password = $('input#password', this.view).val();
          user.password_confirmation = $('input#password_confirmation', this.view).val();
        }
        user.administrator = $('input#administrator', this.view).is(':checked');
        user.active = $('input#active', this.view).is(':checked');
        user.save();

        if(user != undefined) {
          person = user.person();
          if(person != undefined) {
            date_of_birth_year = $('select#date_of_birth_year').val();
            date_of_birth_month = $('select#date_of_birth_month').val() - 1;
            date_of_birth_day = $('select#date_of_birth_day').val();
            date_of_birth = new Date(date_of_birth_year, date_of_birth_month, date_of_birth_day);

            person.first_name = $('input#first_name', this.view).val();
            person.middle_name = $('input#middle_name', this.view).val();
            person.last_name = $('input#last_name', this.view).val();
            person.date_of_birth = date_of_birth;
            person.save();

            employee = person.employee();
            if(employee != undefined) {
              employee.title = $('input#job_title', this.view).val();
              employee.rate = parseInt(Currency.toPennies($('input#rate', this.view).val()));
            } else {
              employee = new Employee({
                title: $('input#title', this.view).val(),
                rate: parseInt(Currency.toPennies($('input#rate', this.view).val()))
              });
              employee.setPerson(person);
              employee.save();
            }

            addresses = person.addresses();
            if(addresses.length > 0) {
              addresses[0].first_line =  $('input#first_line', this.view).val();
              addresses[0].second_line = $('input#second_line', this.view).val();
              addresses[0].city = $('input#city', this.view).val();
              addresses[0].state = $('input#state', this.view).val();
              addresses[0].zip = $('input#zip', this.view).val();
              addresses[0].save();
            } else {
              address = new Address({
                first_line: $('input#first_line', this.view).val(),
                second_line: $('input#second_line', this.view).val(),
                city: $('input#city', this.view).val(),
                state: $('input#state', this.view).val(),
                zip: $('input#zip', this.view).val(),
              });
              address.setPerson(person);
              address.save();
            }

            phones = person.phones();
            if(phones.length > 0) {
              phones[0].number =  $('input#number', this.view).val();
              phones[0].save();
            } else {
              phone = new Phone({
                number: $('input#number', this.view).val()
              });
              phone.setPerson(person);
              phone.save();
            }

            emails = person.emails();
            if(emails.length > 0) {
              emails[0].address =  $('input#address', this.view).val();
              emails[0].save();
            } else {
              email = new Email({
                address: $('input#address', this.view).val()
              });
              email.setPerson(person);
              email.save();
            }

            user.setPerson(person);
          }
        }
      } else {
        date_of_birth_year = $('select#date_of_birth_year').val();
        date_of_birth_month = $('select#date_of_birth_month').val() - 1;
        date_of_birth_day = $('select#date_of_birth_day').val();
        date_of_birth = new Date(date_of_birth_year, date_of_birth_month, date_of_birth_day);

        person = new Person({
          first_name: $('input#first_name', this.view).val(),
          middle_name: $('input#middle_name', this.view).val(),
          last_name: $('input#last_name', this.view).val(),
          date_of_birth: date_of_birth
        });
        if(person.save()) {
          employee = new Employee({
            title: $('input#job_title', this.view).val(),
            rate: parseInt(Currency.toPennies($('input#rate', this.view).val()))
          });
          employee.setPerson(person);
          employee.save();

          address = new Address({
            first_line: $('input#first_line', this.view).val(),
            second_line: $('input#second_line', this.view).val(),
            city: $('input#city', this.view).val(),
            state: $('input#state', this.view).val(),
            zip: $('input#zip', this.view).val(),
          });
          address.setPerson(person);
          address.save();

          phone = new Phone({
            number: $('input#number', this.view).val()
          });
          phone.setPerson(person);
          phone.save();

          email = new Email({
            address: $('input#address', this.view).val()
          });
          email.setPerson(person);
          email.save();
        }

        user = new User({
          login: $('input#login', this.view).val(),
          email: $('input#address', this.view).val(),
          password: $('input#password', this.view).val(),
          password_confirmation: $('input#password_confirmation', this.view).val(),
          pin: $('input#pin', this.view).val(),
          administrator: $('input#administrator', this.view).is(':checked'),
          active: $('input#active', this.view).is(':checked')
        });
        user.setPerson(person);
      }
      if(user.save()) {
        this.update(user);
        this.notifyObservers(user);
      }
    } else {
      this.error();
    }
  },

  valid: function() {
    if($('input#first_name', this.view).val() == '') {
      return false;
    }
    if($('input#last_name', this.view).val() == '') {
      return false;
    }
    if($('input#address', this.view).val() == '') {
      return false;
    }
    if($('input#login', this.view).val() == '') {
      return false;
    }
    if($('input#pin', this.view).val() == '') {
      return false;
    }
    if($('input#password', this.view).val() != $('input#password_confirmation', this.view).val()) {
      return false;
    }
    return true;
  },

  error: function() {
    $(':required', this.view).addClass('error');
  },

  reset: function() {
    this.callSuper();
    $('input#id', this.view).val(0);
    $(':required', this.view).removeClass('error');
  }
});

var EditSelectController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();

    $('select', this.view).bind('change', {instance: this}, this.onUser);
  },

  onUser: function(event) {
    id = parseInt($('select', this.view).val());
    if(!isNaN(id)) {
      event.data.instance.notifyObservers(User.find(id));
    }
    event.preventDefault();
  }
});

var EditUserController = new JS.Class(ViewController, {
  include: Sectionable,

  initialize: function(view) {
    this.callSuper();
  },

  reset: function() {
  }
});

var EditController = new JS.Class(ViewController, {
  include: Sectionable,

  initialize: function(view) {
    this.callSuper();
    this.user = null;

    this.edit_select_controller = new EditSelectController('form#edit_select');
    this.edit_form_controller = new EditFormController('form#edit_user');
    this.edit_user_controller = new EditUserController('div#edit_user');
    this.edit_section_controller = new SectionController('ul#edit_nav', [
      this.edit_user_controller
    ]);

    $('a.new', this.view).bind('click', {instance: this}, this.newUser);

    this.edit_select_controller.addObserver(this.updateUser, this);
  },

  reset: function() {
    this.edit_form_controller.reset();
  },

  updateUser: function(user) {
    this.user = user;
    this.edit_form_controller.update(user);
  },

  newUser: function(event) {
    event.data.instance.reset();
    event.preventDefault();
  }
});

var UsersController = new JS.Class({

  initialize: function() {
    this.edit_controller = new EditController('section#edit');
    this.section_controller = new SectionController('ul#users_nav', [
      this.edit_controller
    ]);
    this.reset();
  },

  reset: function() {
    this.edit_controller.reset();
    this.section_controller.reset();
  }
});

var transactions = {

  run: function() {
    new TerminalController();
  }

};

var dashboard = {

  run: function() {

  }

};

var reports = {

  run: function() {

  }

};

var timeclock = {

  run: function() {
    new TimeclockController();
  }

};

var tills = {

  run: function() {

  }

};

var users = {

  run: function() {
    new UsersController();
  }

};

var AlphabetController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    $('a', this.view).bind('click', {instance: this}, this.onSelect);
  },

  onSelect: function(event) {
    event.data.instance.notifyObservers($(this).html());
    event.preventDefault();
  }
});

var TimecardController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.employee = null;
    this.timecard = null;

    $('a.close', this.view).bind('click', {instance: this}, this.onClose);
    $('a.save', this.view).bind('click', {instance: this}, this.onSave);
  },

  setEmployee: function(employee) {
    this.employee = employee;
  },

  setTimecard: function(timecard) {
    this.timecard = timecard;
    if(timecard != null) {
      begin = (new Date()).setISO8601(timecard.begin);
      end = (new Date()).setISO8601(timecard.end);
      begin_year = begin.getFullYear();
      begin_month = begin.getMonth() + 1;
      begin_day = begin.getDate();
      begin_hour = begin.getHours();
      begin_minute = begin.getMinutes();
      begin_second = begin.getSeconds();
      end_year = end.getFullYear();
      end_month = end.getMonth() + 1;
      end_day = end.getDate();
      end_hour = end.getHours();
      end_minute = end.getMinutes();
      end_second = end.getSeconds();
    } else {
      now = new Date();
      begin_year = now.getFullYear();
      begin_month = now.getMonth() + 1;
      begin_day = now.getDate();
      begin_hour = now.getHours();
      begin_minute = now.getMinutes();
      begin_second = now.getSeconds();
      end_year = now.getFullYear();
      end_month = now.getMonth() + 1;
      end_day = now.getDate();
      end_hour = now.getHours();
      end_minute = now.getMinutes();
      end_second = now.getSeconds();
    }
    $('select#begin_year').val(begin_year);
    $('select#begin_month').val(begin_month);
    $('select#begin_day').val(begin_day);
    $('select#begin_hour').val(this._padNumber(begin_hour));
    $('select#begin_minute').val(this._padNumber(begin_minute));
    $('select#begin_second').val(this._padNumber(begin_second));
    $('select#end_year').val(end_year);
    $('select#end_month').val(end_month);
    $('select#end_day').val(end_day);
    $('select#end_hour').val(this._padNumber(end_hour));
    $('select#end_minute').val(this._padNumber(end_minute));
    $('select#end_second').val(this._padNumber(end_second));
  },

  onClose: function(event) {
    event.data.instance.view.hide();
    event.preventDefault();
  },

  onSave: function(event) {
    begin_year = $('select#begin_year').val();
    begin_month = $('select#begin_month').val() - 1;
    begin_day = $('select#begin_day').val();
    begin_hour = $('select#begin_hour').val();
    begin_minute = $('select#begin_minute').val();
    begin_second = $('select#begin_second').val();
    end_year = $('select#end_year').val();
    end_month = $('select#end_month').val() - 1;
    end_day = $('select#end_day').val();
    end_hour = $('select#end_hour').val();
    end_minute = $('select#end_minute').val();
    end_second = $('select#end_second').val();

    begin = new Date(begin_year, begin_month, begin_day, begin_hour, begin_minute, begin_second);
    end = new Date(end_year, end_month, end_day, end_hour, end_minute, end_second);
    if(event.data.instance.timecard == null) {
      timecard = Timecard.create({
        employee_id: event.data.instance.employee.id,
        begin: begin,
        end: end
      });
    } else {
      timecard = Timecard.find(event.data.instance.timecard.id);
      timecard.begin = begin;
      timecard.end = end;
      timecard.save();
    }
    event.data.instance.notifyObservers();
    event.data.instance.view.hide();
    event.preventDefault();
  },

  _padNumber: function(number) {
    if(number < 10) {
      return '0' + number;
    } else {
      return number;
    }
  }
});

var CustomerReviewController = new JS.Class(ViewController, {
  include: Sectionable,

  initialize: function(view) {
    this.callSuper();
  },

  update: function(customer) {
    $('div#customer_data h3#customer_name', this.view).empty();
    $('div#customer_data div#customer_addresses > p', this.view).empty();
    $('div#customer_data div#customer_phones > p', this.view).empty();
    $('div#customer_data div#customer_emails > p', this.view).empty();

    person = customer.person();
    $('div#customer_data h3#customer_name', this.view).html([
      person.first_name,
      person.middle_name,
      person.last_name
    ].join(' '));

    if(person != undefined) {
      addresses = person.addresses();
      for(address in addresses) {
        $('div#customer_data div#customer_addresses > p', this.view).append('<address>' + [
          addresses[address].first_line,
          addresses[address].second_line,
          addresses[address].city + ',',
          addresses[address].state,
          addresses[address].zip
        ].join(' ') + '</address>');
      }

      phones = person.phones();
      for(phone in phones) {
        if(phones[phone].title != null) {
          phone_string = phones[phone].title + ' - ' + phones[phone].number;
        } else {
          phone_string = phones[phone].number;
        }
        $('div#customer_data div#customer_phones > p', this.view).append('<span>' + phone_string + '</span>');
      }

      emails = person.emails();
      for(email in emails) {
        $('div#customer_data div#customer_emails > p', this.view).append('<span>' + emails[email].address + '</span>');
      }
    }

    $('div#customer_data div#customer_license > p', this.view).html([
      customer.drivers_license_state,
      customer.drivers_license_number
    ].join(' - '));
    $('div#customer_data div#customer_notes > p', this.view).html(customer.notes);
    $('div#customer_data div#customer_flagged > p', this.view).html(Boolean.toString(!customer.active));
    $('div#customer_data div#customer_credit > p', this.view).html(Currency.pretty(customer.credit));
    $('h2#customer_notice').hide();
    $('div#customer_data').show();
  },

  reset: function() {
    $('h2#customer_notice').show();
    $('div#customer_data').hide();
    $('div#customer_data h3#customer_name', this.view).html(null);
    $('div#customer_data div#customer_addresses > p', this.view).html(null);
    $('div#customer_data div#customer_emails > p', this.view).html(null);
    $('div#customer_data div#customer_phones > p', this.view).html(null);
    $('div#customer_data div#customer_license > p', this.view).html(null);
    $('div#customer_data div#customer_notes > p', this.view).html(null);
  }
});

var ReceiptController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    $('ul#receipt_nav a.close', view).bind('click', {instance: this}, this.doClose);
    $('ul#receipt_nav a.print', view).bind('click', {instance: this}, this.doPrint);
  },

  update: function(url) {
    $('object#receipt_window', this.view).attr('data', url);
  },

  doClose: function(event) {
    event.data.instance.view.hide();
    event.preventDefault();
  },

  doPrint: function(event) {
    window.frames['receipt_window'].print();
    event.preventDefault();
  }
});
