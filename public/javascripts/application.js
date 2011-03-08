/* Gameroom Terminal */

var ViewController = new JS.Class({

  initialize: function(view) {
    this.view = $(view);
  }
});

var TillController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    $('ul#till_nav a.select', view).bind('click', {instance: this}, this.doSelect);

    return this.callSuper();
  },

  doSelect: function(event) {
    id = $('div#till select#till_id').val();
    title = $('div#till select#till_id option:selected').html();
    event.data.instance.notifyObservers(new Till(id, title));
    event.preventDefault();
  }
});

var FormController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.reset();

    $('a.clear', this.view).bind('click', {instance: this}, this.onClear);
    $('a.save', this.view).bind('click', {instance: this}, this.onSave);
  },

  reset: function() {
    $(':input', this.view)
      .not(':button, :submit, :reset, :hidden')
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
    $('input#customer_person_first_name', this.view).val(customer.person.first_name);
    $('input#customer_person_middle_name', this.view).val(customer.person.middle_name);
    $('input#customer_person_last_name', this.view).val(customer.person.last_name);
    $('input#customer_credit', this.view).val(Currency.format(customer.credit));
    $('input#customer_drivers_license_number', this.view).val(customer.drivers_license_number);
    $('input#customer_drivers_license_state', this.view).val(customer.drivers_license_state);
    $('input#customer_flagged', this.view).attr('checked', !customer.active);
    $('textarea#customer_notes', this.view).val(customer.notes);
    if(customer.person.addresses.length > 0){
      $('input#customer_person_address_first_line', this.view).val(customer.person.addresses[0].first_line);
      $('input#customer_person_address_second_line', this.view).val(customer.person.addresses[0].second_line);
      $('input#customer_person_address_city', this.view).val(customer.person.addresses[0].city);
      $('input#customer_person_address_state', this.view).val(customer.person.addresses[0].state);
      $('input#customer_person_address_zip', this.view).val(customer.person.addresses[0].zip);
    }
    if(customer.person.phones.length > 0){
      $('input#customer_person_phone_number', this.view).val(customer.person.phones[0].number);
    }
    if(customer.person.emails.length > 0){
      $('input#customer_person_email_address', this.view).val(customer.person.emails[0].address);
    }
  },

  save: function() {
    address = new Address();
    address.first_line = $('input#customer_person_address_first_line', this.view).val();
    address.second_line = $('input#customer_person_address_second_line', this.view).val();
    address.city = $('input#customer_person_address_city', this.view).val();
    address.state = $('input#customer_person_address_state', this.view).val();
    address.zip = $('input#customer_person_address_zip', this.view).val();

    phone = new Phone();
    phone.number = $('input#customer_person_phone_number', this.view).val();

    email = new Email();
    email.address = $('input#customer_person_email_address', this.view).val();

    person = new Person();
    person.first_name = $('input#customer_person_first_name', this.view).val();
    person.middle_name = $('input#customer_person_middle_name', this.view).val();
    person.last_name = $('input#customer_person_last_name', this.view).val();
    person.addresses.push(address);
    person.phones.push(phone);
    person.emails.push(email);

    customer = new Customer();
    customer.id = $('input#customer_id', this.view).val();
    customer.credit = parseInt(Currency.toPennies($('input#customer_credit', this.view).val()));
    customer.notes = $('textarea#customer_notes', this.view).val();
    customer.drivers_license_number = $('input#customer_drivers_license_number', this.view).val();
    customer.drivers_license_state = $('input#customer_drivers_license_state', this.view).val();
    customer.active = !$('input#customer_flagged', this.view).is(':checked');
    customer.person = person;

    if(customer.save()) {
      this.update(customer);
      this.notifyObservers(customer);
    }
  },

  reset: function() {
    this.callSuper();
    $('input#customer_credit', this.view).val(0);
  },

  onClear: function(event) {
    event.data.instance.reset();
    event.preventDefault();
  }
});

var CustomerSearchController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.reset();

    this.customer_query = $('input#customer_query', this.view);
    this.customer_query.bind('change', {instance: this}, this.onChange);
    this.alphabet_controller = new AlphabetController('div#customer_search ul.alphabet_nav', this.customer_query);
    this.alphabet_controller.addObserver(this.onLetter, this);
  },

  reset: function() {
    $(this.customer_query).val(null);
  },

  onLetter: function(letter) {
    $(this.customer_query).val(letter);
    $(this.customer_query).trigger('change');
  },

  onChange: function(event) {
    event.data.instance.notifyObservers($(event.data.instance.customer_query).val());
    event.preventDefault();
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

      $('td.name', new_row).html([
        customers[customer].person.first_name,
        customers[customer].person.last_name
      ].join(' '));
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
      for(phone in customers[customer].person.phones) {
        phone_string = customers[customer].person.phones[phone].title + ' - ' + customers[customer].person.phones[phone].number;
        $('td.phone', new_row).append($('<p></p>').html(phone_string));
      }
      for(email in customers[customer].person.emails) {
        email_string = customers[customer].person.emails[email].address;
        $('td.email', new_row).append($('<p></p>').html(email_string));
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

Factory.define('Customer', {
  id: {
    sequence: 'id'
  },
  person: {
    factory: 'Person'
  },
  credit: 0,
  drivers_license_number: 'H12000000',
  drivers_license_state: 'NE',
  notes: 'Lorem Ipsum...',
  active: true
});
var Person = new JS.Class({

  initialize: function() {
    this.id = null;
    this.first_name = null;
    this.middle_name = null;
    this.last_name = null;
    this.date_of_birth = null;
    this.addresses = [];
    this.phones = [];
    this.emails = [];
  },

  save: function() {

  },

  valid: function() {
    return true;
  }
});

var Customer = new JS.Class({
  extend: {
    find: function(id) {
      return Factory.build('Customer');
    },

    search: function(query) {
      results = [];
      for(i = 0; i < 5; i++){
        results.push(Factory.build('Customer'));
      }
      return results;
    }
  },

  initialize: function() {
    this.id = null;
    this.person = new Person();
    this.credit = null;
    this.drivers_license_number = null;
    this.drivers_license_state = null;
    this.notes = null;
    this.active = false;
  },

  save: function() {
    return true;
  },

  valid: function() {
    return this.id != null;
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
    this.customer_table_controller.update(Customer.search(query));
  },

  onCustomer: function(id) {
    this.notifyObservers(Customer.find(id));
  }
});

var CustomerController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.customer_review_controller = new CustomerReviewController('div#customer_review');
    this.customer_form_controller = new CustomerFormController('div#customer_form');
    this.customer_search_controller = new CustomerSearchController('div#customer_search');
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

  initialize: function(view, line, open) {
    this.callSuper();
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
    $('hgroup.cart_line_information h4', this.view).html(line.item.description);
    $('h4.cart_line_subtotal', this.view).html(Currency.pretty(line.calculateSubtotal()));
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

  onCondition: function(event) {
    index = $('ul.cart_line_sell_condition li a', event.data.instance.view).index(this);
    event.data.instance.line.condition = parseInt($('ul.cart_line_sell_condition li a').eq(index).attr('data-condition'));
    event.data.instance.line.calculatePrice();
    event.data.instance.notifyObservers(event.data.instance.line);
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
    event.data.instance.line.calculatePrice();
    event.data.instance.notifyObservers(event.data.instance.line);
    event.preventDefault();
  },

  onMinus: function(event) {
    quantity = $('input#quantity_amount', event.data.instance.view).val();
    if(quantity > 1) {
      event.data.instance.line.quantity = parseInt(quantity) - 1;
      event.data.instance.line.calculatePrice();
      event.data.instance.notifyObservers(event.data.instance.line);
    }
    event.preventDefault();
  },

  onAction: function(event) {
    index = $('ul.cart_line_action li a', event.data.instance.view).index(this);
    if(index == 0) {
      event.data.instance.line.sell = false;
    } else {
      event.data.instance.line.sell = true;
    }
    event.data.instance.line.calculatePrice();
    event.data.instance.notifyObservers(event.data.instance.line);
    event.preventDefault();
  },

  onRemove: function(event) {
    event.data.instance.line.quantity = 0;
    event.data.instance.notifyObservers(event.data.instance.line);
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
  },

  reset: function() {
    this.clearLines();
    this.showCartNotice();
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
        new_line = new CartLineController(this.line.clone(), lines[line], true);
      } else {
        new_line = new CartLineController(this.line.clone(), lines[line], false);
      }
      new_line.addObserver(this.updateLine, this);
      this.line_controllers.push(new_line);
      $('ul#cart_lines', this.view).append(new_line.view);
    }
    if(lines.length > 0) {
      this.hideCartNotice();
    } else {
      this.showCartNotice();
    }
  },

  clearLines: function() {
    $('ul#cart_lines > li').remove();
  },

  updateLine: function(updated_line) {
    for(line in this.lines) {
      if(this.lines[line].id == updated_line.id) {
        if(updated_line.quantity > 0) {
          this.lines[line] = updated_line;
        } else {
          this.lines.splice(line, 1);
        }
      }
    }
    this.replace(this.lines);
  },

  showCartNotice: function() {
    $('h2#cart_notice', this.view).show();
  },

  hideCartNotice: function() {
    $('h2#cart_notice', this.view).hide();
  }
});
var Line = new JS.Class({

  initialize: function() {
    this.id = null;
    this.transaction = null;
    this.item = null;
    this.sell = false;
    this.condition = 5;
    this.quantity = 0;
    this.price = 0;
  },

  calculatePrice: function() {
    if(this.sell) {
      for(property in this.item.properties) {
        switch(this.item.properties[property].key) {
          case 'credit_price':
            var credit_price = parseInt(this.item.properties[property].value);
            break;
          case 'default':
            break;
        }
      }
      this.price = credit_price * (this.condition / 5) * -1;
    } else {
      this.price = this.item.price;
    }
  },

  calculateSubtotal: function() {
    return this.quantity * this.price;
  },

  calculateCashSubtotal: function() {
    for(property in this.item.properties) {
      switch(this.item.properties[property].key) {
        case 'cash_price':
          cash_price = parseInt(this.item.properties[property].value);
          break;
        case 'default':
          break;
      }
    }
    return this.quantity * cash_price;
  },

  valid: function() {
    return true;
  }
});
var Item = new JS.Class({
  extend: {
    find: function(id) {
      credit = new Property();
      credit.key = 'credit_price';
      credit.value = 800;
      cash = new Property();
      cash.key = 'cash_price';
      cash.value = 500;
      return Factory.build('Item', {properties: [
        credit,
        cash
      ]});
    },

    search: function(query) {
      results = [];
      credit = new Property();
      credit.key = 'credit_price';
      credit.value = 800;
      cash = new Property();
      cash.key = 'cash_price';
      cash.value = 500;
      for(i = 0; i < 5; i++){
        results.push(Factory.build('Item', {properties: [
          credit,
          cash
        ]}));
      }
      return results;
    }
  },

  initialize: function() {
    this.id = null;
    this.properties = [];
    this.title = null;
    this.description = null;
    this.sku = null;
    this.price = 0;
    this.taxable = false;
    this.discountable = false;
    this.locked = false;
    this.active = false;
  },

  valid: function() {
    return true;
  }
});
var Property = new JS.Class({

  initialize: function() {
    this.id = null;
    this.key = null;
    this.value = null;
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
  },

  save: function() {
    lines = [];
    $('ul.item_elements', this.view).each(function() {
      line = new Line();
      item = new Item();
      credit_property = new Property();
      cash_property = new Property();

      item.title = $('input#item_title', this).val();
      item.description = $('input#item_description', this).val();
      item.price = parseInt(Currency.toPennies($('input#item_price', this).val()));
      item.taxable = $('input#item_taxable', this).attr('checked');

      credit_property.key = 'credit_price';
      credit_property.value = parseInt(Currency.toPennies($('input#item_credit', this).val()));
      cash_property.key = 'cash_price'
      cash_property.value = parseInt(Currency.toPennies($('input#item_cash', this).val()));

      line.item = item;
      line.sell = false;
      line.condition = 5;
      line.quantity = parseInt($('input#item_quantity', this).val());
      line.price = line.item.price * line.quantity;
      line.item.properties.push(credit_property);
      line.item.properties.push(cash_property);
      lines.push(line);
    });
    console.log(lines);
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

  onMore: function(event) {
    $('ul.item_nav', event.data.instance.view).before(event.data.instance.row.clone());
    event.preventDefault();
  },

  onLess: function(event) {
    $('ul.item_elements', event.data.instance.view).last().remove();
    event.preventDefault();
  },

  onClear: function(event) {
    event.data.instance.reset();
    event.preventDefault();
  }
});

var CartSearchController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.reset();

    this.cart_query = $('input#cart_query', this.view);
    this.cart_query.bind('change', {instance: this}, this.onChange);
    this.alphabet_controller = new AlphabetController('div#cart_search ul.alphabet_nav', this.cart_query);
    this.alphabet_controller.addObserver(this.onLetter, this);
  },

  reset: function() {
    $(this.cart_query).val(null);
  },

  onLetter: function(letter) {
    $(this.cart_query).val(letter);
    $(this.cart_query).trigger('change');
  },

  onChange: function(event) {
    event.data.instance.notifyObservers($(this.cart_query).val());
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
      $('td.description', new_row).html(items[item].description);
      $('td.sku', new_row).html(items[item].sku);
      $('td.price', new_row).html(Currency.pretty(items[item].price));
      $('td.taxable', new_row).html(Boolean.toString(items[item].taxable));
      $('td.credit_price', new_row).html(Currency.pretty(0));
      $('td.cash_price', new_row).html(Currency.pretty(0));
      for(property in items[item].properties) {
        switch(items[item].properties[property].key) {
          case 'credit_price':
            $('td.credit_price', new_row).html(Currency.pretty(items[item].properties[property].value));
            break;
          case 'cash_price':
            $('td.cash_price', new_row).html(Currency.pretty(items[item].properties[property].value));
            break;
          default:
            break;
        }
      }
      $('tbody', this.view).append(new_row);
    }
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
    this.cart_table_controller.update(Item.search(query));
  },

  onItem: function(id) {
    line = new Line();
    line.id = id;
    line.item = Item.find(id);
    line.sell = false;
    line.condition = 5;
    line.quantity = 1;
    line.calculatePrice();
    this.notifyObservers([line]);
  }
});

var CartController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.cart_lines_controller = new CartLinesController('div#cart_lines');
    this.cart_form_controller = new CartFormController('div#cart_form');
    this.cart_search_controller = new CartSearchController('div#cart_search');
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
  },

  update: function(transaction) {
    $('h2#cart_summary', this.view).html(transaction.countItems() + ' item(s) in cart: ' + Currency.pretty(transaction.subtotal()));
  },

  showLinesSection: function() {
    this.cart_page_controller.showSection(0);
  },

  showSearchSection: function() {
    this.cart_page_controller.showSection(2);
  },

  addLines: function(lines) {
    this.showLinesSection();
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
    this.disable();
    this.reset();
    this.due = 0;
    $('input.payment', this.view).bind('change', {instance: this}, this.onChange);
  },

  reset: function() {
    this.due = 0;
    $('input.payment', this.view).val(null);
  },

  enable: function() {
    $('input.payment', this.view).attr('disabled', false);
  },

  disable: function() {
    $('input.payment', this.view).attr('disabled', true);
  },

  update: function(due, amount) {
    this.due = due;
    console.log(amount);
  },

  onChange: function(event) {
    if(!isNaN($(this).val())) {
      payment = new Payment($(this).attr('data-payment-form'), Currency.toPennies($(this).val()));
      event.data.instance.notifyObservers(payment);
    } else {
      $(this).val(null);
    }
  }
});

var PaymentLineController = new JS.Class(PaymentFieldController, {

  initialize: function(view) {
    this.callSuper();
    $('a.clear', this.view).bind('click', {instance: this}, this.onClear);
    $('a.apply', this.view).bind('click', {instance: this}, this.onApply);
  },

  onApply: function(event) {
    input = $('input.payment', event.data.instance.view);
    input.val(Currency.format(event.data.instance.due));
    input.trigger('change');
    event.preventDefault();
  },

  onClear: function(event) {
    input = $('input.payment', event.data.instance.view);
    input.val(null);
    input.trigger('change');
    event.preventDefault();
  }
});
var StoreCreditController = new JS.Class(PaymentLineController, {

  initialize: function(view) {
    this.callSuper();
  },

  /*enable: function() {
    if(this.transaction.customer.id != null) {
      this.callSuper();
    }
  },

  onApply: function(event) {
    if(event.data.instance.transaction.customer.credit > event.data.instance.transaction.total()) {
      amount = event.data.instance.transaction.total();
    } else {
      amount = event.data.instance.transaction.customer.credit;
    }
    $('div#payment_store_credit input#store_credit_amount').val(Currency.format(amount));
    event.data.instance.payment.amount = amount;
    event.data.instance.notifyObservers(event.data.instance.payment);
    event.preventDefault();
  },

  onChange: function(event) {
    if(!isNaN($(this).val())) {
      amount = Currency.toPennies($(this).val());
      credit = event.data.instance.transaction.customer.credit;
      total = event.data.instance.transaction.total();

      if(amount > credit) {
        event.data.instance.payment.amount = credit;
      } else {
        event.data.instance.payment.amount = amount;
      }
      if(event.data.instance.payment.amount > total) {
        event.data.instance.payment.amount = total;
      }
      if(event.data.instance.payment.amount != 0) {
        $(this).val(Currency.format(event.data.instance.payment.amount));
      } else {
        $(this).val(null);
      }
      event.data.instance.notifyObservers(event.data.instance.payment);
    } else {
      $(this).val(null);
    }
  },

  update: function(due, transaction) {
    this.transaction = transaction;
    if(transaction.customer.id != null) {
      $('div#payment_store_credit span#payment_customer').html(transaction.customer.person.first_name + ' ' + transaction.customer.person.last_name + ': ' + Currency.pretty(transaction.customer.credit));
      $('div#payment_store_credit a.apply').show();
      this.enable();
    }
  }*/

});
var Till = new JS.Class({

  initialize: function(id, title) {
    this.id = id;
    this.title = title;
  },

  valid: function() {
    return true;
  }
});
var Receipt = new JS.Class({

  initialize: function(quantity) {
    this.quantity = quantity;
  },

  valid: function() {
    return true;
  }
});
var Payment = new JS.Class({

  initialize: function(form, amount) {
    this.id = null;
    this.form = form;
    this.amount = amount;
  },

  valid: function() {
    return true;
  }
});

var Transaction = new JS.Class({

  initialize: function() {
    this.id = null;
    this.till = new Till();
    this.customer = new Customer();
    this.receipt = new Receipt();
    this.lines = [];
    this.payments = [
      new Payment('store_credit', 0),
      new Payment('gift_card', 0),
      new Payment('credit_card', 0),
      new Payment('check', 0),
      new Payment('cash', 0)
    ];
    this.tax_rate = 0.07;
    this.complete = false;
    this.locked = false;
  },

  subtotal: function() {
    subtotal = 0;
    for(line in this.lines) {
      subtotal += this.lines[line].calculateSubtotal();
    }
    return subtotal;
  },

  total: function() {
    return this.subtotal() + this.tax();
  },

  tax: function() {
    subtotal = this.subtotal();
    if(subtotal > 0) {
      return subtotal * this.tax_rate;
    } else {
      return 0;
    }
  },

  change: function() {
    payment_total = 0;
    for(payment in this.payments) {
      payment_total += this.payments[payment].amount;
    }
    return this.total() - payment_total;
  },

  ratio: function() {
    return 1.0 / Math.abs(this.subtotal() / this.cashSubtotal());
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
  },

  updatePayment: function(updated_payment) {
    for(payment in this.payments) {
      if(this.payments[payment].form == updated_payment.form) {
        this.payments[payment] = updated_payment;
      }
    }
  },

  save: function() {
    this.id = 1;
    return true;
  },

  valid: function() {
    if(this.change() == 0 && this.customer.valid()) {
      return true;
    } else {
      return false;
    }
  }

  /*onCreditChange: function(event) {
    ratio = event.data.instance.transaction.ratio();
    total = event.data.instance.transaction.total();
    credit = Currency.toPennies($(this).val());
    if(credit > Math.abs(total)) {
      credit = Math.abs(total);
    }
    cash = (Math.abs(total) - Math.abs(credit)) * ratio;
    $('input#payment_action_cash_value', this.view).val(Currency.format(cash));
    $(this).val(Currency.format(credit));
    event.data.instance.notifyObservers();
    event.preventDefault();
  },

  onCashChange: function(event) {
    ratio = event.data.instance.transaction.ratio();
    total = event.data.instance.transaction.total();
    cash = Currency.toPennies($(this).val());
    cash_subtotal = event.data.instance.transaction.cashSubtotal();
    if(cash > cash_subtotal) {
      cash = cash_subtotal;
    }
    credit = (1.0 / ratio) * (cash_subtotal - cash);
    $('input#payment_action_credit_value', this.view).val(Currency.format(credit));
    $(this).val(Currency.format(cash));
    event.data.instance.notifyObservers();
    event.preventDefault();
  },*/
});

var ScaleController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.callSuper();
    this.transaction = new Transaction();
    $('ul#payment_scale_container a.button').bind('click', {instance: this}, this.onScale)
  },

  onScale: function(event) {
    index = parseFloat($('ul#payment_scale_container li a.button').index(this));
    /*ratio = event.data.instance.transaction.ratio();
    total = event.data.instance.transaction.total();
    credit = total * ((10 - index) / 10.0);
    cash = (Math.abs(total) - Math.abs(credit)) * ratio;
    $('input#payment_action_cash_value', this.view).val(Currency.format(Math.abs(cash)));
    $('input#payment_action_credit_value', this.view).val(Currency.format(Math.abs(credit)));
    event.data.instance.notifyObservers();*/
    event.preventDefault();
  },

  update: function(transaction) {
    this.transaction = transaction;
  }

});

var PaymentController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.scale_controller = new ScaleController('ul#payment_scale_container');
    this.store_credit_controller = new StoreCreditController('div#payment_store_credit');
    this.gift_card_controller = new PaymentLineController('div#payment_gift_card');
    this.check_controller = new PaymentLineController('div#payment_check');
    this.credit_card_controller = new PaymentLineController('div#payment_credit_card');
    this.cash_controller = new PaymentLineController('div#payment_cash');
    this.store_credit_payout_controller = new PaymentFieldController('li#payment_scale_store_credit');
    this.cash_payout_controller = new PaymentFieldController('li#payment_scale_cash');
    this.store_credit_controller.addObserver(this.updatePayment, this);
    this.gift_card_controller.addObserver(this.updatePayment, this);
    this.check_controller.addObserver(this.updatePayment, this);
    this.credit_card_controller.addObserver(this.updatePayment, this);
    this.cash_controller.addObserver(this.updatePayment, this);
    this.store_credit_payout_controller.addObserver(this.updatePayment, this);
    this.cash_payout_controller.addObserver(this.updatePayment, this);
    this.reset();
    this.callSuper();
  },

  reset: function() {
    this.resetSummary();
    this.resetPaymentFields();
    this.enableBuyFromStore();
  },

  resetSummary: function() {
    $('div#payment_summary span#payment_summary_items', this.view).html('0 item(s) in cart');
    $('div#payment_summary span#payment_summary_subtotal', this.view).html('$0.00 ($0.00)');
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
    for(payment in transaction.payments) {
      switch(transaction.payments[payment].form) {
        case 'store_credit':
          this.store_credit_controller.update(transaction.change(), transaction.payments[payment].amount);
          this.store_credit_payout_controller.update(transaction.change(), transaction.payments[payment].amount);
          break;
        case 'cash':
          this.cash_controller.update(transaction.change(), transaction.payments[payment].amount);
          this.cash_payout_controller.update(transaction.change(), transaction.payments[payment].amount);
          break;
        case 'gift_card':
          this.gift_card_controller.update(transaction.change(), transaction.payments[payment].amount);
          break;
        case 'credit_card':
          this.credit_card_controller.update(transaction.change(), transaction.payments[payment].amount);
          break;
        case 'check':
          this.check_controller.update(transaction.change(), transaction.payments[payment].amount);
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

  updatePayment: function(payment) {
    console.log(payment);
    this.notifyObservers(payment);
  },

  updateSummary: function(transaction) {
    $('div#payment_summary span#payment_summary_items', this.view).html(transaction.countItems() + ' item(s) in cart');
    $('div#payment_summary span#payment_summary_subtotal', this.view).html(Currency.pretty(transaction.subtotal()));
    $('div#payment_summary span#payment_summary_tax', this.view).html('Tax: ' + Currency.pretty(transaction.tax()));
    $('div#payment_summary span#payment_summary_total', this.view).html('Total: ' + Currency.pretty(transaction.total()));
    if(transaction.change() >= 0) {
      $('div#payment_action span#payment_change', this.view).html('Change Due: ' + Currency.pretty(transaction.change()));
    } else {
      $('div#payment_action span#payment_change', this.view).html('Amount Due: ' + Currency.pretty(Math.abs(transaction.change())));
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
  },

  update: function(transaction) {
    $('div#review_summary table > tbody > tr#payment', this.view).remove()
    $('div#review_lines table > tbody > tr', this.view).remove();

    for(line in transaction.lines) {
      var new_line = this.line.clone();
      $('td.quantity', new_line).html(transaction.lines[line].quantity);
      $('td.title', new_line).html(transaction.lines[line].item.title);
      $('td.description', new_line).html(transaction.lines[line].item.description);
      $('td.sku', new_line).html(transaction.lines[line].item.sku);
      $('td.price', new_line).html(Currency.pretty(transaction.lines[line].price));
      $('td.subtotal', new_line).html(Currency.pretty(transaction.lines[line].calculateSubtotal()));
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
    if(transaction.change() >= 0) {
      $('div#review_summary table > tbody > tr#change > td', this.view).eq(0).html('Change Due');
      $('div#review_summary table > tbody > tr#change > td', this.view).eq(1).html(Currency.pretty(transaction.change()));
    } else {
      $('div#review_summary table > tbody > tr#change > td', this.view).eq(0).html('Amount Due');
      $('div#review_summary table > tbody > tr#change > td', this.view).eq(1).html(Currency.pretty(Math.abs(transaction.change())));
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

var PageController = new JS.Class(ViewController, {

  initialize: function(view, sections) {
    this.callSuper();
    this.sections = sections;
    this.reset();
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
    this.showSection(0);
  }
});

var SummaryController = new JS.Class(ViewController, {

  reset: function() {
    this.setCustomer(new Customer());
    this.setItemCount(0);
    this.setTotal(0);
    this.view.show();
  },

  update: function(transaction) {
    this.setCustomer(transaction.customer);
    this.setItemCount(transaction.countItems());
    this.setTotal(transaction.total());
  },

  setItemCount: function(count) {
    $('h2#summary_item_count', this.view).html(count + ' item(s)');
  },

  setCustomer: function(customer) {
    if(customer.id == null) {
      $('h2#summary_customer', this.view).html("Select a customer...");
    } else {
      $('h2#summary_customer', this.view).html(customer.person.first_name + ' ' + customer.person.last_name);
    }
  },

  setTotal: function(total) {
    $('h2#summary_total', this.view).html(Currency.pretty(total));
  }
});

var FinishController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    $('a', view).bind('click', {instance: this}, this.finish)
    this.callSuper();
  },

  finish: function(event) {
    event.data.instance.notifyObservers();
    event.preventDefault();
  },

  update: function(transaction) {
    if(transaction.valid()) {
      this.view.show();
    }
  }
});

var TransactionController = new JS.Class({
  include: JS.Observable,

  transactions: [],

  initialize: function() {
    this.till = new Till();
    this.current_transaction = null;

    this.transaction_nav = $('ul#transaction_nav');
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
    this.summary_controller = new SummaryController('ul#summary');
    this.finish_controller = new FinishController('ul#finish');

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

    this.reset();
    this.customer_controller.view.hide();
    this.section_controller.view.hide();
    this.summary_controller.view.hide();
    this.finish_controller.view.hide();
    this.transaction_nav.hide();
  },

  reset: function() {
    this.customer_controller.reset();
    this.cart_controller.reset();
    this.payment_controller.reset();
    this.review_controller.reset();
    this.section_controller.reset();
    this.summary_controller.reset();
    this.section_controller.view.show();
  },

  updateCustomer: function(customer) {
    if(this.current_transaction) {
      this.current_transaction.customer = customer;
      this.notifyObservers(this.current_transaction);
    }
  },

  updateCart: function(lines) {
    if(this.current_transaction) {
      this.current_transaction.setLines(lines);
      this.notifyObservers(this.current_transaction);
    }
  },

  updatePayment: function(payment) {
    if(this.current_transaction) {
      this.current_transaction.updatePayment(payment);
      this.notifyObservers(this.current_transaction);
    }
  },

  updateReceipt: function(quantity) {
    if(this.current_transaction) {
      this.current_transaction.receipt.quantity = quantity;
    }
  },

  newTransaction: function(till) {
    this.reset();
    this.till = till;
    this.addTransaction(new Transaction());
    this.setCurrentTransaction(this.transactions.length - 1);
  },

  addTransaction: function(transaction) {
    this.transactions.push(transaction);
  },

  removeTransaction: function(index) {
    this.transactions.splice(index, 1);
  },

  setCurrentTransaction: function(index) {
    this.current_transaction = this.transactions[index];
  },

  saveTransaction: function() {
    if(this.current_transaction.save()) {
      id = this.current_transaction.id;
      url = '/transactions/' + id + '/receipt';
      window.open(url);
    }
  }
});

var TerminalController = new JS.Class({

  initialize: function() {

    this.transaction_controller = new TransactionController();
    this.till_controller = new TillController('div#till');
    this.user_nav = $('ul#user_nav').hide();

    this.till_controller.view.show();
    this.till_controller.addObserver(this.updateTill, this);

    $('form').submit(function(event) {
      event.preventDefault();
    });
  },

  updateTill: function(till) {
    this.transaction_controller.newTransaction(till);
    $('li.current_user_till', this.user_nav).html(till.title);
    $(this.user_nav).show();
    this.till_controller.view.hide();
  }
});

var gameroomlincoln_terminal = {

  run: function() {

    new TerminalController();

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
    $('div#customer_data h3#customer_name', this.view).html([
      customer.person.first_name,
      customer.person.middle_name,
      customer.person.last_name
    ].join(' '));
    if(customer.person.addresses.length > 0) {
      $('div#customer_data div#customer_addresses > p', this.view).html([
        customer.person.addresses[0].first_line,
        customer.person.addresses[0].second_line,
        customer.person.addresses[0].city + ',',
        customer.person.addresses[0].state,
        customer.person.addresses[0].zip
      ].join(' '));
    }
    if(customer.person.phones.length > 0){
      $('div#customer_data div#customer_phones > p', this.view).html(customer.person.phones[0].number);
    }
    if(customer.person.emails.length > 0){
      $('div#customer_data div#customer_emails > p', this.view).html(customer.person.emails[0].address);
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
    $('div#customer_data h3#customer_name', this.view).html(null);
    $('div#customer_data div#customer_addresses > p', this.view).html(null);
    $('div#customer_data div#customer_emails > p', this.view).html(null);
    $('div#customer_data div#customer_phones > p', this.view).html(null);
    $('div#customer_data div#customer_license > p', this.view).html(null);
    $('div#customer_data div#customer_notes > p', this.view).html(null);
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

  initialize: function() {
    this.id = null;
    this.first_line = null;
    this.second_line = null;
    this.city = null;
    this.state = null;
    this.province = null;
    this.country = null;
    this.zip = null
  },

  save: function() {

  },

  valid: function() {
    return true;
  }
});
var Email = new JS.Class({

  initialize: function() {
    this.id = null;
    this.address = null;
  },

  save: function() {

  },

  valid: function() {
    return true;
  }
});
var Entry = new JS.Class({

  initialize: function() {
    this.id = null;
    this.title = null;
    this.description = null;
    this.time = new Date();
    this.amount = 0;
    this.action = 'debit';
  },

  valid: function() {
    return true;
  }
});
var Phone = new JS.Class({

  initialize: function() {
    this.id = null;
    this.title = null;
    this.number = null;
  },

  save: function() {

  },

  valid: function() {
    return true;
  }
});
