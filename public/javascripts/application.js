/* Gameroom */
var ViewController = new JS.Class({

  initialize: function(view) {
    this.view = $(view);
  }
});
var Factory = new JS.Class({
  extend: {
    factories: [],

    build: function(klass, properties) {
      var factory = this._factory_fetch(klass);
      if(factory != null && window[klass] != undefined) {
        var properties = this._merge_properties(factory.properties, properties);
        var object = new window[klass];
        for(property in properties) {
          if(properties[property].sequence != undefined) {
            object[property] = this.sequence(klass, properties[property].sequence);
          } else if(properties[property].factory != undefined) {
            object[property] = this.build(properties[property].factory);
          } else if(properties[property].factories != undefined) {
            object[property] = [this.build(properties[property].factories)];
          } else {
            object[property] = properties[property];
          }
        }
        return object;
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

Factory.define('Till', {
  id: {
    sequence: 'id'
  },
  title: 'Title'
});

var Till = new JS.Class({
  extend: {
    find: function(id, callback) {
      $.ajax({
        url: '/api/tills/' + id,
        accept: 'application/json',
        success: function(results) {
          callback(results.till);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.error('Error Status: ' + XMLHttpRequest.status);
          console.error('Error Text: ' + textStatus);
          console.error('Error Thrown: ' + errorThrown);
          console.log(XMLHttpRequest);
        },
        username: 'x',
        password: 'x',
        dataType: 'json'
      });
    }
  },

  initialize: function(params) {
    this.id = params.id;
    this.title = params.title;
  },

  valid: function() {
    return true;
  }
});

var TillController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    $('ul#till_nav a.select', view).bind('click', {instance: this}, this.doSelect);

    return this.callSuper();
  },

  doSelect: function(event) {
    Till.find($('div#till select#till_id').val(), function(till) {
      if(till != null) {
        event.data.instance.notifyObservers(new Till(till));
      }
    });
    event.preventDefault();
  }
});

var SearchController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();

    this.query = $('input.query', this.view);
    this.query.bind('change', {instance: this}, this.onChange);
    this.alphabet_controller = new AlphabetController($('ul.alphabet_nav', this.view));
    this.alphabet_controller.addObserver(this.onLetter, this);
    $('a.clear', this.view).bind('click', {instance: this}, this.onClear);
    this.reset();
  },

  reset: function() {
    this.query.val(null);
  },

  onLetter: function(letter) {
    this.query.val(letter);
    this.query.trigger('change');
  },

  onClear: function(event) {
    event.data.instance.query.val(null);
    event.preventDefault();
  },

  onChange: function(event) {
    event.data.instance.notifyObservers(event.data.instance.query.val());
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

  initialize: function(view) {
    this.callSuper();
  },

  update: function(customer) {
    if(customer != undefined) {
      $('input#customer_id', this.view).val(customer.id);
      $('input#customer_credit', this.view).val(Currency.format(customer.credit));
      $('input#customer_drivers_license_number', this.view).val(customer.drivers_license_number);
      $('input#customer_drivers_license_state', this.view).val(customer.drivers_license_state);
      $('input#customer_flagged', this.view).attr('checked', !customer.active);
      $('textarea#customer_notes', this.view).val(customer.notes);

      if(customer.person != undefined) {
        $('input#customer_person_first_name', this.view).val(customer.person.first_name);
        $('input#customer_person_middle_name', this.view).val(customer.person.middle_name);
        $('input#customer_person_last_name', this.view).val(customer.person.last_name);

        if(customer.person.addresses != undefined) {
          if(customer.person.addresses.length > 0){
            $('input#customer_person_address_first_line', this.view).val(customer.person.addresses[0].first_line);
            $('input#customer_person_address_second_line', this.view).val(customer.person.addresses[0].second_line);
            $('input#customer_person_address_city', this.view).val(customer.person.addresses[0].city);
            $('input#customer_person_address_state', this.view).val(customer.person.addresses[0].state);
            $('input#customer_person_address_zip', this.view).val(customer.person.addresses[0].zip);
          }
        }
        if(customer.person.phones != undefined) {
          if(customer.person.phones.length > 0){
            $('input#customer_person_phone_number', this.view).val(customer.person.phones[0].number);
          }
        }
        if(customer.person.emails != undefined) {
          if(customer.person.emails.length > 0){
            $('input#customer_person_email_address', this.view).val(customer.person.emails[0].address);
          }
        }
      } else {
        $('input#customer_person_first_name', this.view).val(null);
        $('input#customer_person_middle_name', this.view).val(null);
        $('input#customer_person_last_name', this.view).val(null);
        $('input#customer_person_address_first_line', this.view).val(null);
        $('input#customer_person_address_second_line', this.view).val(null);
        $('input#customer_person_address_city', this.view).val(null);
        $('input#customer_person_address_state', this.view).val(null);
        $('input#customer_person_address_zip', this.view).val(null);
        $('input#customer_person_phone_number', this.view).val(null);
        $('input#customer_person_email_address', this.view).val(null);
      }
    } else {
      this.reset();
    }
  },

  save: function() {
    address = new Address({
      first_line: $('input#customer_person_address_first_line', this.view).val(),
      second_line: $('input#customer_person_address_second_line', this.view).val(),
      city: $('input#customer_person_address_city', this.view).val(),
      state: $('input#customer_person_address_state', this.view).val(),
      zip: $('input#customer_person_address_zip', this.view).val(),
    });

    phone = new Phone({
      number: $('input#customer_person_phone_number', this.view).val()
    });

    email = new Email({
      address: $('input#customer_person_email_address', this.view).val()
    });

    person = new Person({
      first_name: $('input#customer_person_first_name', this.view).val(),
      middle_name: $('input#customer_person_middle_name', this.view).val(),
      last_name: $('input#customer_person_last_name', this.view).val(),
      addresses: [address],
      phones: [phone],
      emails: [email]
    });

    customer = new Customer({
      id: $('input#customer_id', this.view).val(),
      person: person,
      credit: parseInt(Currency.toPennies($('input#customer_credit', this.view).val())),
      notes: $('textarea#customer_notes', this.view).val(),
      drivers_license_number: $('input#customer_drivers_license_number', this.view).val(),
      drivers_license_state: $('input#customer_drivers_license_state', this.view).val(),
      active: !$('input#customer_flagged', this.view).is(':checked')
    });

    controller = this;
    customer.save(function(customer) {
      controller.update(new Customer(customer));
      controller.notifyObservers(new Customer(customer));
    });
  },

  reset: function() {
    this.callSuper();
    $('input#customer_credit', this.view).val(0);
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

  update: function(customers) {
    this.reset();

    for(customer in customers){
      new_row = $(this.table_row).clone();
      new_row.attr('data-object-id', customers[customer].id);

      if(customers[customer].person != undefined) {
        $('td.name', new_row).html([
          customers[customer].person.first_name,
          customers[customer].person.last_name
        ].join(' '));
        if(customers[customer].person.addresses != undefined) {
          for(address in customers[customer].person.addresses) {
            address_string = [
              customers[customer].person.addresses[address].first_line,
              customers[customer].person.addresses[address].second_line,
              customers[customer].person.addresses[address].city + ',',
              customers[customer].person.addresses[address].state,
              customers[customer].person.addresses[address].province,
              customers[customer].person.addresses[address].country,
              customers[customer].person.addresses[address].zip
            ].join(' ');
            $('td.address', new_row).append($('<address></address>').html(address_string));
          }
        }
        if(customers[customer].person.phones != undefined) {
          for(phone in customers[customer].person.phones) {
            if(customers[customer].person.phones[phone].title != null) {
              phone_string = customers[customer].person.phones[phone].title + ' - ' + customers[customer].person.phones[phone].number;
            } else {
              phone_string = customers[customer].person.phones[phone].number;
            }
            $('td.phone', new_row).append($('<p></p>').html(phone_string));
          }
        }
        if(customers[customer].person.emails != undefined) {
          for(email in customers[customer].person.emails) {
            email_string = customers[customer].person.emails[email].address;
            $('td.email', new_row).append($('<p></p>').html(email_string));
          }
        }
      }

      $('td.credit', new_row).html(Currency.pretty(customers[customer].credit));
      $('td.drivers_license', new_row).html([
        customers[customer].drivers_license_number,
        customers[customer].drivers_license_state
      ].join(' '));
      $('td.flagged', new_row).html(Boolean.toString(!customers[customer].active));
      $('td.notes', new_row).html(customers[customer].notes);
      $('tbody', this.view).append(new_row);
    }
  }
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
var Person = new JS.Class({

  initialize: function(params) {
    this.id = params.id;
    this.first_name = params.first_name;
    this.middle_name = params.middle_name;
    this.last_name = params.last_name;
    this.date_of_birth = params.date_of_birth;
    this.addresses = [];
    for(address in params.addresses) {
      this.addresses.push(new Address(params.addresses[address]));
    }
    this.phones = [];
    for(phone in params.phones) {
      this.phones.push(new Phone(params.phones[phone]));
    }
    this.emails = [];
    for(email in params.emails) {
      this.emails.push(new Email(params.emails[email]));
    }
  },

  save: function() {

  },

  valid: function() {
    return true;
  }
});

var Customer = new JS.Class({
  extend: {
    find: function(id, callback) {
      $.ajax({
        url: '/api/customers/' + id,
        accept: 'application/json',
        dataType: 'json',
        success: function(results) {
          callback(results.customer);
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
    },

    search: function(query, callback) {
      $.ajax({
        url: '/api/customers/search',
        data: JSON.stringify({
          search: {
            person_first_name_or_person_last_name_contains: query
          },
          page: 1,
          per_page: 25
        }),
        dataType: 'json',
        accept: 'application/json',
        contentType: 'application/json',
        processData: false,
        type: 'POST',
        success: function(results) {
          callback(results);
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

  initialize: function(params) {
    this.id = params.id;
    if(params.person != undefined) {
      this.person = new Person(params.person);
    } else {
      this.person = undefined;
    }
    this.credit = params.credit;
    this.drivers_license_number = params.drivers_license_number;
    this.drivers_license_state = params.drivers_license_state;
    this.notes = params.notes;
    this.active = params.active;
  },

  save: function(callback) {
    if(this.valid()) {
      customer = {
        credit: this.credit,
        drivers_license_number: this.drivers_license_number,
        drivers_license_state: this.drivers_license_state,
        notes: this.notes,
        active: this.active
      };

      if(this.person != null) {
        customer.person_attributes = {
          first_name: this.person.first_name,
          middle_name: this.person.middle_name,
          last_name: this.person.last_name,
          emails_attributes: [],
          addresses_attributes: [],
          phones_attributes: []
        }
        for(email in this.person.emails) {
          customer.person_attributes.emails_attributes.push({
            address: this.person.emails[email].address
          });
        }
        for(address in this.person.addresses) {
          customer.person_attributes.addresses_attributes.push({
            first_line: this.person.addresses[address].first_line,
            second_line: this.person.addresses[address].second_line,
            city: this.person.addresses[address].city,
            state: this.person.addresses[address].state,
            country: this.person.addresses[address].country,
            zip: this.person.addresses[address].zip
          });
        }
        for(phone in this.person.phones) {
          customer.person_attributes.phones_attributes.push({
            title: this.person.phones[phone].title,
            number: this.person.phones[phone].number
          });
        }
      }

      if(this.id == undefined || this.id == 0) {
        url = '/api/customers';
        type = 'POST';
      } else {
        url = '/api/customers/' + this.id;
        type = 'PUT';
      }

      $.ajax({
        url: url,
        accept: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify({customer: customer}),
        dataType: 'json',
        processData: false,
        type: type,
        success: function(result) {
          callback(result.customer);
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
    } else {
      return false;
    }
  },

  valid: function() {
    return true;
  }
});

var CustomerSearchResultsController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.customer_table_controller = new CustomerTableController($('table', this.view));
    this.customer_table_controller.addObserver(this.onCustomer, this);
  },

  reset: function() {
    this.customer_table_controller.reset();
  },

  search: function(query) {
    controller = this;
    Customer.search(query, function(customers) {
      customers_results = [];
      for(customer in customers) {
        customers_results.push(new Customer(customers[customer].customer));
      }
      controller.customer_table_controller.update(customers_results);
    });
  },

  onCustomer: function(id) {
    controller = this;
    Customer.find(id, function(customer) {
      if(customer != null) {
        controller.notifyObservers(new Customer(customer));
      }
    });
  }
});

var CustomerController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.customer_review_controller = new CustomerReviewController('div#customer_review');
    this.customer_form_controller = new CustomerFormController('div#customer_form');
    this.customer_search_controller = new SearchController('div#customer_search');
    this.customer_search_results_controller = new CustomerSearchResultsController('div#customer_search_results');
    this.customer_page_controller = new PageController('ul#customer_nav', [
      this.customer_review_controller.view,
      this.customer_form_controller.view,
      this.customer_search_results_controller.view
    ]);
    this.customer_search_controller.addObserver(this.customer_search_results_controller.search, this.customer_search_results_controller);
    this.customer_search_controller.addObserver(this.showSearchSection, this);
    this.customer_search_results_controller.addObserver(this.setCustomer, this);
    this.customer_form_controller.addObserver(this.setCustomer, this);

    this.reset();
  },

  reset: function() {
    this.customer_review_controller.reset();
    this.customer_form_controller.reset();
    this.customer_search_controller.reset();
    this.customer_search_results_controller.reset();
    this.customer_page_controller.reset();
    this.showFormSection();
  },

  showReviewSection: function() {
    this.customer_page_controller.showSection(0);
  },

  showFormSection: function() {
    this.customer_page_controller.showSection(1);
  },

  showSearchSection: function(query) {
    if(query) {
      this.customer_page_controller.showSection(2);
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
    this.set(this.line);
    $('a.remove', this.view).bind('click', {instance: this}, this.onRemove);
    $('a.info', this.view).bind('click', {instance: this}, this.onInfo);
    $('a.plus', this.view).bind('click', {instance: this}, this.onPlus);
    $('a.minus', this.view).bind('click', {instance: this}, this.onMinus);
    $('ul.cart_line_action li a', this.view).bind('click', {instance: this}, this.onAction);
    $('ul.cart_line_sell_condition li a', this.view).bind('click', {instance: this}, this.onCondition);
  },

  set: function(line) {
    $('input#quantity_amount', this.view).val(line.quantity);
    $('hgroup.cart_line_information h3', this.view).html(line.item.title);
    $('hgroup.cart_line_information h4', this.view).html(String.truncate(line.item.description, 50)).attr('title', line.item.description);
    $('h4.cart_line_subtotal', this.view).html(Currency.pretty(line.subtotal()));
    $('ul.cart_line_action li a', this.view).removeClass('selected');
    for(property in line.item.properties) {
      switch(line.item.properties[property].key) {
        case 'credit_price':
          $('span.cart_line_credit_value', this.view).html('Credit Value: ' + Currency.pretty(line.item.properties[property].value * (line.condition / 5)));
          break;
        case 'cash_price':
          $('span.cart_line_cash_value', this.view).html('Cash Value: ' + Currency.pretty(line.item.properties[property].value * (line.condition / 5)));
          break;
        default:
          break;
      }
    }
    $('ul.cart_line_sell_condition li a', this.view).removeClass('selected');
    $('ul.cart_line_sell_condition li a', this.view).eq(line.condition - 1).addClass('selected');
    if(line.sell) {
      $('ul.cart_line_action li a.sell', this.view).addClass('selected');
      this.showControls();
    } else {
      $('ul.cart_line_action li a.purchase', this.view).addClass('selected');
      this.hideControls();
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
    this.line.sell = false;
    this.notifyObservers(this.line_index, this.line);
  },

  setSell: function() {
    this.line.sell = true;
    this.notifyObservers(this.line_index, this.line);
  },

  onCondition: function(event) {
    index = $('ul.cart_line_sell_condition li a', event.data.instance.view).index(this);
    event.data.instance.line.condition = parseInt($('ul.cart_line_sell_condition li a').eq(index).attr('data-condition'));
    event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    event.preventDefault();
  },

  onInfo: function(event) {
    $('div.cart_info', event.data.instance.view).toggle();
    event.data.instance.open = !event.data.instance.open;
    event.preventDefault();
  },

  onPlus: function(event) {
    quantity = $('input#quantity_amount', event.data.instance.view).val();
    event.data.instance.line.quantity = parseInt(quantity) + 1;
    event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
    event.preventDefault();
  },

  onMinus: function(event) {
    quantity = $('input#quantity_amount', event.data.instance.view).val();
    if(quantity > 1) {
      event.data.instance.line.quantity = parseInt(quantity) - 1;
      event.data.instance.notifyObservers(event.data.instance.line_index, event.data.instance.line);
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

  showControls: function() {
    $('ul.cart_line_sell_control', this.view).css('display', 'block');
  },

  hideControls: function() {
    $('ul.cart_line_sell_control', this.view).hide();
  }
});

var CartLinesController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.lines = [];
    this.line_controllers = [];
    this.line = $('li.cart_line', view).detach();
    this.hideCartNav();
    $('ul#cart_lines_nav a.remove', view).bind('click', {instance: this}, this.onRemove);
    $('ul#cart_lines_nav a.info', view).bind('click', {instance: this}, this.onInfo);
    $('ul#cart_lines_nav a.purchase', view).bind('click', {instance: this}, this.onPurchase);
    $('ul#cart_lines_nav a.sell', view).bind('click', {instance: this}, this.onSell);
  },

  reset: function() {
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
    this.lines = [];
    this.line_controllers = [];
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
var Line = new JS.Class({

  initialize: function(params) {
    this.id = params.id;
    if(params.transaction != undefined) {
      this.transaction = new Transaction(params.transaction);
    } else {
      this.transaction = undefined;
    }
    if(params.item != undefined) {
      this.item = new Item(params.item);
    } else {
      this.item = undefined;
    }
    this.sell = params.sell;
    this.condition = params.condition;
    this.quantity = params.quantity;
    this.price = params.price;
  },

  subtotal: function() {
    return this.quantity * this._creditPrice();
  },

  _creditPrice: function() {
    if(this.sell) {
      this.price = this.item.creditPrice() * (this.condition / 5) * -1;
    } else {
      this.price = this.item.price;
    }
    return this.price;
  },

  _cashPrice: function() {
    if(this.sell) {
      this.price = this.item.cashPrice() * (this.condition / 5) * -1;
    } else {
      this.price = this.item.price;
    }
    return this.price;
  },

  purchaseCreditSubtotal: function() {
    if(this.sell) {
      return 0;
    } else {
      return this.quantity * this._creditPrice();
    }
  },

  creditSubtotal: function() {
    if(this.sell) {
      return this.quantity * this._creditPrice();
    } else {
      return 0;
    }
  },

  cashSubtotal: function() {
    if(this.sell) {
      return this.quantity * this._cashPrice();
    } else {
      return 0;
    }
  },

  valid: function() {
    if(this.item != undefined) {
      return this.quantity > 0 && this.price > 0 && this.item.valid();
    } else {
      return this.quantity > 0 && this.price > 0;
    }
  }
});
var Item = new JS.Class({
  extend: {
    find: function(id, callback) {
      $.ajax({
        url: '/api/items/' + id,
        accept: 'application/json',
        dataType: 'json',
        success: function(results) {
          callback(results.item);
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
    },

    search: function(query, callback) {
      $.ajax({
        url: '/api/items/search',
        data: JSON.stringify({
          search: {
            title_or_description_or_sku_contains: query
          },
          page: 1,
          per_page: 25
        }),
        dataType: 'json',
        accept: 'application/json',
        contentType: 'application/json',
        processData: false,
        type: 'POST',
        success: function(results) {
          callback(results);
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

  initialize: function(params) {
    this.id = params.id;
    this.properties = [];
    for(property in params.properties) {
      this.properties.push(new Property(params.properties[property]));
    }
    this.title = params.title;
    this.description = params.description;
    this.sku = params.sku;
    this.price = params.price;
    this.taxable = params.taxable;
    this.discountable = params.discountable;
    this.locked = params.locked;
    this.active = params.active;
  },

  creditPrice: function() {
    var credit_price = 0;
    for(property in this.properties) {
      switch(this.properties[property].key) {
        case 'credit_price':
          credit_price = parseInt(this.properties[property].value);
          break;
        case 'default':
          break;
      }
    }
    return credit_price;
  },

  cashPrice: function() {
    var cash_price = 0;
    for(property in this.properties) {
      switch(this.properties[property].key) {
        case 'cash_price':
          cash_price = parseInt(this.properties[property].value);
          break;
        case 'default':
          break;
      }
    }
    return cash_price;
  },

  valid: function() {
    return this.title != '' && this.price > 0;
  }
});
var Property = new JS.Class({

  initialize: function(params) {
    this.id = params.id;
    this.key = params.key;
    this.value = params.value;
  },

  valid: function() {
    return true;
  }
});

var CartFormController = new JS.Class(FormController, {

  initialize: function(view) {
    this.callSuper();
    this.row = $('ul.item_elements', view).first().clone();

    $('a.more', this.view).bind('click', {instance: this}, this.onMore);
    $('a.less', this.view).bind('click', {instance: this}, this.onLess);
    $('input.price', this.view).bind('change', {instance: this}, this.onPrice);
    $('a.clear_row', this.view).live('click', {instance: this}, this.onClearRow);
  },

  save: function() {
    lines = [];
    $('ul.item_elements', this.view).each(function() {
      credit_price = parseInt(Currency.toPennies($('input#item_credit', this).val()));
      if(credit_price <= 0) {
        credit_price = 0;
      }

      cash_price = parseInt(Currency.toPennies($('input#item_cash', this).val()));
      if(cash_price <= 0) {
        cash_price = 0;
      }

      line = new Line({
        sell: false,
        condition: 5,
        quantity: parseInt(Math.abs($('input#item_quantity', this).val())),
        price: parseInt(Currency.toPennies($('input#item_price', this).val())),
        item: {
          title: $('input#item_title', this).val(),
          description: $('input#item_description', this).val(),
          price: parseInt(Currency.toPennies($('input#item_price', this).val())),
          taxable: $('input#item_taxable', this).attr('checked'),
          properties: [
            {
              key: 'credit_price',
              value: credit_price
            },
            {
              key: 'cash_price',
              value: cash_price
            }
          ]
        }
      });

      if(line.valid()) {
        lines.push(line);
      }
    });
    if(this.valid(lines)) {
      this.notifyObservers(lines);
    }
  },

  valid: function(lines) {
    valid = false;
    for(line in lines) {
      valid = lines[line].valid();
    }
    return valid;
  },

  reset: function() {
    this.callSuper();
    $('input#item_taxable', this.view).attr('checked', true);
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
    $('ul.item_elements', event.data.instance.view).last().remove();
    event.preventDefault();
  },

  onClear: function(event) {
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
      .removeAttr('selected');
    event.preventDefault();
  }
});

var CartTableController = new JS.Class(TableController, {

  update: function(items) {
    this.reset();

    for(item in items){
      new_row = $(this.table_row).clone();
      new_row.attr('data-object-id', items[item].id);

      $('td.title', new_row).html(items[item].title);
      $('td.description', new_row).html(String.truncate(items[item].description, 50)).attr('title', items[item].description);
      $('td.sku', new_row).html(items[item].sku);
      $('td.price', new_row).html(Currency.pretty(items[item].price));
      $('td.taxable', new_row).html(Boolean.toString(items[item].taxable));
      for(property in items[item].properties) {
        processed = this._processProperty(items[item].properties[property]);
        $('td.properties ul', new_row).append('<li><span>' + processed.key + ': </span><span>' + processed.value + '</span></li>');
      }
      $('tbody', this.view).append(new_row);
    }
  },

  _processProperty: function(property) {
    switch(property.key) {
      case 'credit_price':
      case 'cash_price':
        property.value = Currency.pretty(property.value);
        break;
      default:
        break;
    }
    property.key = String.capitalize(property.key.split('_').join(' '));
    return property;
  }
});

var CartSearchResultsController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.cart_table_controller = new CartTableController($('table', this.view));
    this.cart_table_controller.addObserver(this.onItem, this);
  },

  reset: function() {
    this.cart_table_controller.reset();
  },

  search: function(query) {
    controller = this;
    Item.search(query, function(items) {
      items_results = [];
      for(item in items) {
        items_results.push(new Item(items[item].item));
      }
      controller.cart_table_controller.update(items_results);
    });
  },

  onItem: function(id) {
    controller = this;
    Item.find(id, function(item) {
      if(item != null) {
        line = new Line({
          sell: false,
          condition: 5,
          quantity: 1,
          item: item
        });
        controller.notifyObservers([new Line(line)]);
      }
    });
  }
});

var CartController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.cart_lines_controller = new CartLinesController('div#cart_lines');
    this.cart_form_controller = new CartFormController('div#cart_form');
    this.cart_search_controller = new SearchController('div#cart_search');
    this.cart_search_results_controller = new CartSearchResultsController('div#cart_search_results');
    this.cart_page_controller = new PageController('ul#cart_nav', [
      this.cart_lines_controller.view,
      this.cart_form_controller.view,
      this.cart_search_results_controller.view
    ]);
    this.cart_search_controller.addObserver(this.cart_search_results_controller.search, this.cart_search_results_controller);
    this.cart_search_controller.addObserver(this.showSearchSection, this);
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
    this.cart_page_controller.reset();
    $('h2#cart_summary', this.view).html('0 item(s): ' + Currency.pretty(0));
  },

  update: function(transaction) {
    $('h2#cart_summary', this.view).html(transaction.countItems() + ' item(s): ' + Currency.pretty(transaction.subtotal()));
  },

  showLinesSection: function() {
    this.cart_page_controller.showSection(0);
  },

  showSearchSection: function() {
    this.cart_page_controller.showSection(2);
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
    this.amount_due = amount_due;

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
    this.enabled = false;
    $('a.clear', this.view).bind('click', {instance: this}, this.onClear);
    $('a.apply', this.view).bind('click', {instance: this}, this.onApply);
  },

  enable: function() {
    this.enabled = true;
    this.callSuper();
  },

  disable: function() {
    this.enabled = true;
    this.callSuper();
  },

  onApply: function(event) {
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
    this.customer = new Customer({});
    this.callSuper();
  },

  enable: function() {
    if(this.customer.id != null) {
      this.callSuper();
    } else {
      this.disable();
    }
  },

  update: function(amount, amount_due, customer) {
    if(customer != undefined) {
      if(customer.id != null) {
        this.customer = customer;
        if(this.customer.person != null) {
          $('div#payment_store_credit span#payment_customer').html(this.customer.person.first_name + ' ' + this.customer.person.last_name + ': ' + Currency.pretty(this.customer.credit));
        } else {
          $('div#payment_store_credit span#payment_customer').empty();
        }
        this.enable();
      }
    } else {
      $('div#payment_store_credit span#payment_customer').empty();
    }
    this.callSuper(amount, amount_due);
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

  update: function(amount, amount_due) {
    this.amount_due = amount_due;

    if(amount < 0) {
      $('input.payment', this.view).val(Currency.format(amount * -1));
    } else {
      $('input.payment', this.view).val(null);
    }
  },

  onChange: function(event) {
    if(!isNaN($(this).val())) {
      event.data.instance.notifyObservers(new Payment($(this).attr('data-payment-form'), Currency.toPennies(Math.abs($(this).val()) * -1)));
    } else {
      $(this).val(null);
    }
  }
});
var Receipt = new JS.Class({

  initialize: function(params) {
    this.quantity = params.quantity;
  },

  valid: function() {
    return true;
  }
});
var Payment = new JS.Class({

  initialize: function(params) {
    this.id = params.id;
    this.form = params.form;
    this.amount = params.amount;
  },

  valid: function() {
    return true;
  }
});

var Transaction = new JS.Class({

  initialize: function(params) {
    this.id = params.id;
    if(params.till != undefined) {
      this.till = new Till(params.till);
    } else {
      this.till = undefined;
    }
    if(params.customer != undefined) {
      this.customer = new Customer(params.customer);
    } else {
      this.customer = undefined;
    }
    if(params.receipt != undefined) {
      this.receipt = new Receipt(params.receipt);
    } else {
      this.receipt = undefined;
    }
    this.lines = [];
    for(line in params.lines) {
      this.lines.push(new Line(params.lines[line].line));
    }
    this.payments = [
      new Payment({form: 'store_credit', amount: 0}),
      new Payment({form: 'gift_card', amount: 0}),
      new Payment({form: 'credit_card', amount: 0}),
      new Payment({form: 'check', amount: 0}),
      new Payment({form: 'cash', amount: 0})
    ];
    this.tax_rate = params.tax_rate;
    this.complete = params.complete;
    this.locked = params.locked;
  },

  subtotal: function() {
    subtotal = 0;
    for(line in this.lines) {
      subtotal += this.lines[line].subtotal();
    }
    return parseInt(subtotal);
  },

  total: function() {
    return parseInt(this.subtotal() + this.tax());
  },

  tax: function() {
    subtotal = this.subtotal();
    if(subtotal > 0) {
      return parseInt(Math.floor(subtotal * this.tax_rate));
    } else {
      return 0;
    }
  },

  amountDue: function() {
    if(this.subtotal() >= 0) {
      payment_total = 0;
      for(payment in this.payments) {
        payment_total += parseInt(Math.floor(this.payments[payment].amount));
      }
      return this.total() - payment_total;
    } else {
      cash_payment = new Payment({form: 'cash', amount: 0});
      for(payment in this.payments) {
        if(this.payments[payment].form == 'cash') {
          cash_payment = this.payments[payment];
        }
      }
      if(cash_payment.amount != 0) {
        return cash_payment.amount;
      } else {
        return 0;
      }
    }
  },

  ratio: function() {
    return 1.0 / Math.abs(this.creditSubtotal() / this.cashSubtotal());
  },

  countItems: function() {
    count = 0;
    for(line in this.lines) {
      count += this.lines[line].quantity;
    }
    return count;
  },

  setLines: function(lines) {
    this.lines = lines;

    subtotal = this.subtotal();
    for(payment in this.payments) {
      if(subtotal < 0 && this.payments[payment].amount > 0) {
        this.payments[payment].amount = 0;
      }
      if(subtotal >= 0 && this.payments[payment].amount < 0) {
        this.payments[payment].amount = 0;
      }
      if(subtotal >= 0 && this.payments[payment].form == 'store_credit' && this.payments[payment].amount > this.total()) {
        this.payments[payment].amount = 0;
      }
      if(subtotal < 0 && this.payments[payment].form == 'store_credit') {
        this.payments[payment].amount = this._calculateStoreCreditPayout(0) * -1;
        this._updatePayment('cash', new Payment({form: 'cash', amount: 0}));
      }
    }
  },

  purchaseCreditSubtotal: function() {
    var subtotal = 0;
    for(line in this.lines) {
      subtotal += this.lines[line].purchaseCreditSubtotal();
    }
    return subtotal;
  },

  payoutCreditSubtotal: function() {
    return this.creditSubtotal() - this.purchaseCreditSubtotal();
  },

  payoutCashSubtotal: function() {
    return this.payoutCreditSubtotal() * this.ratio();
  },

  creditSubtotal: function() {
    var subtotal = 0;
    for(line in this.lines) {
      subtotal += this.lines[line].creditSubtotal();
    }
    return Math.abs(subtotal);
  },

  cashSubtotal: function() {
    var subtotal = 0;
    for(line in this.lines) {
      subtotal += this.lines[line].cashSubtotal();
    }
    return Math.abs(subtotal);
  },

  updatePayment: function(updated_payment) {
    if(this.subtotal() < 0) {
      switch(updated_payment.form) {
        case 'store_credit':
          store_credit_subtotal = this.payoutCreditSubtotal();
          if(Math.abs(updated_payment.amount) > store_credit_subtotal) {
            updated_payment.amount = store_credit_subtotal * -1;
          }
          this._updatePayment('cash', new Payment({form: 'cash', amount: this._calculateCashPayout(Math.abs(updated_payment.amount)) * -1}));
          break;
        case 'cash':
          cash_subtotal = this.payoutCashSubtotal();
          if(Math.abs(updated_payment.amount) > cash_subtotal) {
            updated_payment.amount = cash_subtotal * -1;
          }
          this._updatePayment('store_credit', new Payment({form: 'store_credit', amount: this._calculateStoreCreditPayout(Math.abs(updated_payment.amount)) * -1}));
          break;
        default:
          break;
      }
    }
    this._updatePayment(updated_payment.form, updated_payment);
  },

  _updatePayment: function(form, updated_payment) {
    for(payment in this.payments) {
      if(this.payments[payment].form == form) {
        this.payments[payment] = updated_payment;
      }
    }
  },

  _calculateStoreCreditPayout: function(cash_amount) {
    return (1.0 / this.ratio()) * (this.payoutCashSubtotal() - cash_amount);
  },

  _calculateCashPayout: function(store_credit_amount) {
    return (this.payoutCreditSubtotal() - store_credit_amount) * this.ratio();
  },

  save: function(callback) {
    if(this.valid()) {
      transaction = {
        till_id: this.till.id,
        tax_rate: this.tax_rate,
        complete: this.complete,
        locked: this.locked,
        payments_attributes: [],
        lines_attributes: []
      };
      for(payment in this.payments) {
        transaction.payments_attributes.push({
          form: this.payments[payment].form,
          amount: this.payments[payment].amount
        });
      }
      for(line in this.lines) {
        if(this.lines[line].item.id != undefined) {
          transaction.lines_attributes.push({
            item_id: this.lines[line].item.id,
            quantity: this.lines[line].quantity,
            price: this.lines[line].price
          });
        } else {
          transaction.lines_attributes.push({
            quantity: this.lines[line].quantity,
            price: this.lines[line].price,
            item_attributes: {
              title: this.lines[line].item.title,
              description: this.lines[line].item.description,
              price: this.lines[line].item.price,
              taxable: this.lines[line].item.taxable,
              discountable: this.lines[line].item.discountable,
              locked: this.lines[line].item.locked,
              active: this.lines[line].item.active,
            }
          });
        }
      }
      if(this.customer != undefined) {
        transaction.customer_id = this.customer.id;
      }

      $.ajax({
        url: '/api/transactions',
        accept: 'application/json',
        contentType: 'application/json',
        data: JSON.stringify({transaction: transaction}),
        dataType: 'json',
        processData: false,
        type: 'POST',
        success: function(result) {
          callback(result.transaction);
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

      return true;
    } else {
      return false;
    }
  },

  valid: function() {
    if(this.total() > 0 && this.amountDue() <= 0) {
      return true;
    } else if(this.total() < 0) {
      if(this.customer != undefined) {
        if(this.customer.valid()) {
          return true;
        }
      }
    }
    return false;
  }
});

var PaymentScaleController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.transaction = null;
    $('ul#payment_scale_container a.button').bind('click', {instance: this}, this.onScale);
  },

  onScale: function(event) {
    index = parseFloat($(this).attr('data-index'));
    amount = Currency.format(Math.abs(event.data.instance.transaction.payoutCreditSubtotal()) * (index / 10.0));
    event.data.instance.notifyObservers(amount);
    event.preventDefault();
  },

  update: function(transaction) {
    this.transaction = transaction;
  }

});

var PaymentController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
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
    this.store_credit_payout_controller.addObserver(this.updatePayment, this);
    this.cash_payout_controller.addObserver(this.updatePayment, this);
    this.scale_controller.addObserver(this.onScale, this);
    this.reset();
  },

  reset: function() {
    this.resetSummary();
    this.resetPaymentFields();
    this.enableBuyFromStore();
  },

  resetSummary: function() {
    $('div#payment_summary span#payment_summary_items', this.view).html('0 item(s) in cart');
    $('div#payment_summary span#payment_summary_subtotal', this.view).html('$0.00');
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
    this.store_credit_controller.enable();
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
    amount_due = transaction.amountDue();
    for(payment in transaction.payments) {
      switch(transaction.payments[payment].form) {
        case 'store_credit':
          this.store_credit_controller.update(transaction.payments[payment].amount, amount_due, transaction.customer);
          this.store_credit_payout_controller.update(transaction.payments[payment].amount, amount_due);
          break;
        case 'cash':
          this.cash_controller.update(transaction.payments[payment].amount, amount_due);
          this.cash_payout_controller.update(transaction.payments[payment].amount, amount_due);
          break;
        case 'gift_card':
          this.gift_card_controller.update(transaction.payments[payment].amount, amount_due);
          break;
        case 'credit_card':
          this.credit_card_controller.update(transaction.payments[payment].amount, amount_due);
          break;
        case 'check':
          this.check_controller.update(transaction.payments[payment].amount, amount_due);
          break;
      }
    }

    this.scale_controller.update(transaction);
    this.updateSummary(transaction);

    if(transaction.total() >= 0) {
      this.enableBuyFromStore();
    } else {
      this.enableSellToStore();
    }
  },

  onScale: function(amount) {
    this.store_credit_payout_controller.set(amount);
  },

  updatePayment: function(payment) {
    this.notifyObservers(payment);
  },

  updateSummary: function(transaction) {
    amount_due = transaction.amountDue();
    $('div#payment_summary span#payment_summary_items', this.view).html(transaction.countItems() + ' item(s) in cart');
    $('div#payment_summary span#payment_summary_subtotal', this.view).html(Currency.pretty(transaction.subtotal()));
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
      return currency * 100;
    }
  }
});
var String = new JS.Class({
  extend: {
    ucfirst: function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    capitalize: function(string) {
      sentence = string.split(' ');
      for(word in sentence) {
        sentence[word] = String.ucfirst(sentence[word])
      }
      return sentence.join(' ');
    },

    truncate: function(string, length) {
      return string.substr(0, length - 1) + (string.length > length? '...' : '');
    }
  }
});

var ReviewController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    $('input#receipt_quantity', view).bind('change', {instance: this}, this.onReceiptQuantityChanged);
    this.payment_row = $('div#review_summary table > tbody > tr#payment', view).detach();
    this.line = $('div#review_lines table > tbody > tr', view).detach();
    this.reset();
    this.callSuper();
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

    if(transaction.customer != undefined) {
      if(transaction.customer.id == null) {
        $('h2#review_customer', this.view).html("No customer");
      } else {
        if(transaction.customer.person != null) {
          $('h2#review_customer', this.view).html(transaction.customer.person.first_name + ' ' + transaction.customer.person.last_name);
        } else {
          $('h2#review_customer', this.view).empty();
        }
      }
    }

    $('div#review_summary table > tbody > tr#payment', this.view).remove();
    $('div#review_lines table > tbody > tr', this.view).remove();

    for(line in transaction.lines) {
      var new_line = this.line.clone();
      $('td.quantity', new_line).html(transaction.lines[line].quantity);
      $('td.title', new_line).html(transaction.lines[line].item.title);
      $('td.description', new_line).html(String.truncate(transaction.lines[line].item.description, 50)).attr('title', transaction.lines[line].item.description);
      $('td.sku', new_line).html(transaction.lines[line].item.sku);
      $('td.price', new_line).html(Currency.pretty(transaction.lines[line].price));
      $('td.subtotal', new_line).html(Currency.pretty(transaction.lines[line].subtotal()));
      $('div#review_lines table tbody').append(new_line);
    }
    for(payment in transaction.payments) {
      if(transaction.payments[payment].amount != 0) {
        var new_payment_row = this.payment_row.clone();
        $('td', new_payment_row).eq(0).html(String.capitalize(transaction.payments[payment].form.replace('_', ' ')));
        $('td', new_payment_row).eq(1).html(Currency.pretty(transaction.payments[payment].amount));
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
  },

  onReceiptQuantityChanged: function(event) {
    var quantity = $(this).val();
    if(!isNaN(quantity)) {
      event.data.instance.notifyObservers(quantity);
    } else {
      $(this).val(1);
      event.data.instance.notifyObservers(1);
    }
  },

  setReceiptQuantity: function(quantity) {
    this.notifyObservers(quantity);
  }
});

var TransactionSummaryController = new JS.Class(ViewController, {

  reset: function() {
    this.setCustomer(new Customer({}));
    this.setItemCount(0);
    this.setTotal(0);
    this.view.show();
  },

  update: function(transaction) {
    if(transaction.customer != undefined) {
      this.setCustomer(transaction.customer);
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
      if(customer.person != null) {
        $('h2#summary_customer', this.view).html(customer.person.first_name + ' ' + customer.person.last_name);
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
    if(transaction.valid()) {
      this.enable();
    } else {
      this.disable();
    }
  }
});

var PageController = new JS.Class(ViewController, {

  initialize: function(view, sections) {
    this.callSuper();
    this.sections = sections;
    $('a', view).bind('click', {instance: this, view: this.view}, this.doClick);
  },

  doClick: function(event) {
    index = $('li > a', event.data.view).index(this);
    event.data.instance.showSection(index);
    event.preventDefault();
  },

  showSection: function(index) {
    this.hideSections();
    this.sections[index].show();
    $('li > a', this.view).removeClass('selected');
    $('li', this.view).eq(index).find('a').addClass('selected');
  },

  hideSections: function() {
    for(section in this.sections) {
      $(this.sections[section]).hide();
    }
  },

  reset: function() {
    this.view.show();
    this.showSection(0);
  }
});

var TransactionController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function() {
    this.callSuper();
    this.till = null;
    this.transaction = null;

    this.customer_controller = new CustomerController('section#customer');
    this.cart_controller = new CartController('section#cart');
    this.payment_controller = new PaymentController('section#payment');
    this.review_controller = new ReviewController('section#review');
    this.section_controller = new PageController('ul#section_nav', [
      this.customer_controller.view,
      this.cart_controller.view,
      this.payment_controller.view,
      this.review_controller.view
    ]);
    this.summary_controller = new TransactionSummaryController('ul#summary');
    this.finish_controller = new TransactionFinishController('ul#finish');

    this.customer_controller.addObserver(this.updateCustomer, this);
    this.cart_controller.addObserver(this.updateCart, this);
    this.payment_controller.addObserver(this.updatePayment, this);
    this.review_controller.addObserver(this.updateReceipt, this);
    this.finish_controller.addObserver(this.saveTransaction, this);

    this.addObserver(this.cart_controller.update, this.cart_controller);
    this.addObserver(this.payment_controller.update, this.payment_controller);
    this.addObserver(this.review_controller.update, this.review_controller);
    this.addObserver(this.summary_controller.update, this.summary_controller);
    this.addObserver(this.finish_controller.update, this.finish_controller);

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
    event.data.instance.newTransaction(event.data.instance.till);
    event.preventDefault();
  },

  updateCustomer: function(customer) {
    if(this.transaction) {
      this.transaction.customer = customer;
      this.notifyObservers(this.transaction);
    }
  },

  updateCart: function(lines) {
    if(this.transaction) {
      this.transaction.setLines(lines);
      this.notifyObservers(this.transaction);
    }
  },

  updatePayment: function(payment) {
    if(this.transaction) {
      this.transaction.updatePayment(payment);
      this.notifyObservers(this.transaction);
    }
  },

  updateReceipt: function(quantity) {
    if(this.transaction) {
      this.transaction.receipt.quantity = quantity;
    }
  },

  newTransaction: function(till) {
    this.reset();
    this.till = till;
    this.setTransaction(new Transaction({till: till, tax_rate: 0.07, complete: false, locked: false}));
  },

  setTransaction: function(transaction) {
    this.transaction = transaction;
    this.notifyObservers(transaction);
  },

  saveTransaction: function() {
    controller = this;
    this.transaction.save(function(transaction) {
      controller.newTransaction(controller.till);
      url = '/api/transactions/' + transaction.id + '/receipt';
      window.open(url, "transaction_receipt", "toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=260");
    });
  }
});

var TerminalUserController = new JS.Class(ViewController, {

  initialize: function(view) {
    this.callSuper();
  },

  update: function(till) {
    $('li.current_user_till', this.view).html(till.title);
  }
});

var TerminalController = new JS.Class({

  initialize: function() {
    this.terminal_user_controller = new TerminalUserController('ul#user_nav');
    this.transaction_controller = new TransactionController('div#transaction');
    this.till_controller = new TillController('div#till');
    this.till_controller.addObserver(this.updateTill, this);

    this.reset();
  },

  reset: function() {
    this.transaction_controller.view.hide();
    this.till_controller.view.show();
  },

  updateTill: function(till) {
    this.transaction_controller.newTransaction(till);
    this.terminal_user_controller.update(till);
    this.till_controller.view.hide();
    this.transaction_controller.view.show();
  }
});

var terminal = {

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

var CustomerReviewController = new JS.Class(ViewController, {

  initialize: function(view) {
    this.callSuper();
  },

  update: function(customer) {
    $('div#customer_data div#customer_addresses > p', this.view).empty();
    $('div#customer_data div#customer_phones > p', this.view).empty();
    $('div#customer_data div#customer_emails > p', this.view).empty();

    if(customer.person != undefined) {
      $('div#customer_data h3#customer_name', this.view).html([
        customer.person.first_name,
        customer.person.middle_name,
        customer.person.last_name
      ].join(' '));

      if(customer.person.addresses != undefined) {
        if(customer.person.addresses.length > 0) {
          for(address in customer.person.addresses) {
            $('div#customer_data div#customer_addresses > p', this.view).append('<address>' + [
              customer.person.addresses[address].first_line,
              customer.person.addresses[address].second_line,
              customer.person.addresses[address].city + ',',
              customer.person.addresses[address].state,
              customer.person.addresses[address].zip
            ].join(' ') + '</address>');
          }
        }
      }
      if(customer.person.phones != undefined) {
        if(customer.person.phones.length > 0){
          for(phone in customer.person.phones) {
            if(customer.person.phones[phone].title != null) {
              phone_string = customer.person.phones[phone].title + ' - ' + customer.person.phones[phone].number;
            } else {
              phone_string = customer.person.phones[phone].number;
            }
            $('div#customer_data div#customer_phones > p', this.view).append('<span>' + phone_string + '</span>');
          }
        }
      }
      if(customer.person.emails != undefined) {
        if(customer.person.emails.length > 0){
          for(email in customer.person.emails) {
            $('div#customer_data div#customer_emails > p', this.view).append('<span>' + customer.person.emails[email].address + '</span>');
          }
        }
      }
    } else {
      $('div#customer_data h3#customer_name', this.view).empty();
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

var CustomerSearchController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.reset();

    this.query = $('input.query', this.view);
    this.query.bind('change', {instance: this}, this.onChange);
    this.alphabet_controller = new AlphabetController('ul.alphabet_nav', this.view);
    this.alphabet_controller.addObserver(this.onLetter, this);
    $('a.clear', this.view).bind('click', {instance: this}, this.onClear)
  },

  reset: function() {
    $(this.query).val(null);
  },

  onLetter: function(letter) {
    $(this.query).val(letter);
    $(this.query).trigger('change');
  },

  onClear: function(event) {
    event.data.instance.query.val(null);
    event.preventDefault();
  },

  onChange: function(event) {
    event.data.instance.notifyObservers(event.data.instance.query.val());
    event.preventDefault();
  }
});

Factory.define('Address', {
  id: {
    sequence: 'id'
  },
  first_line: '555 Street Way',
  second_line: 'Suite 309',
  city: 'Lincoln',
  state: 'NE',
  province: '',
  country: 'US',
  zip: '68508'
});

Factory.define('Email', {
  id: {
    sequence: 'id'
  },
  address: 'example@example.com'
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
  middle_name: 'T',
  last_name: 'Customer',
  date_of_birth: new Date()
});

Factory.define('Phone', {
  id: {
    sequence: 'id'
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
var Address = new JS.Class({

  initialize: function(params) {
    this.id = params.id;
    this.first_line = params.first_line;
    this.second_line = params.second_line;
    this.city = params.city;
    this.state = params.state;
    this.country = params.country;
    this.zip = params.zip;
  },

  save: function() {

  },

  valid: function() {
    return true;
  }
});
var Email = new JS.Class({

  initialize: function(params) {
    this.id = params.id;
    this.address = params.address;
  },

  save: function() {

  },

  valid: function() {
    return true;
  }
});
var Entry = new JS.Class({

  initialize: function(params) {
    this.id = params.id;
    this.title = params.title;
    this.description = params.description;
    if(params.time != undefined) {
      this.time = new Date(params.time);
    } else {
      this.time = new Date();
    }
    this.amount = params.amount;
    this.action = params.action;
  },

  valid: function() {
    return true;
  }
});
var Phone = new JS.Class({

  initialize: function(params) {
    this.id = params.id;
    this.title = params.title;
    this.number = params.number;
  },

  save: function() {

  },

  valid: function() {
    return true;
  }
});
