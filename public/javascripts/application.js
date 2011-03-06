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

  initialize: function(view, line) {
    this.callSuper();
    this.line = line;
    this.update(this.line);
    $('a.remove', this.view).bind('click', {instance: this}, this.onRemove);
  },

  update: function(line) {

  },

  onRemove: function(event) {
    event.data.instance.line.quantity = 0;
    event.data.instance.notifyObservers(event.data.instance.line);
    event.preventDefault();
  },
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
    $('ul#cart_lines > li').remove();
    this.showCartNotice();
  },

  update: function(lines) {
    this.reset();
    for(line in lines) {
      this.lines.push(lines[line]);
    }
    this.line_controllers = [];
    for(line in this.lines) {
      new_line = new CartLineController(this.line.clone(), this.lines[line]);
      new_line.addObserver(this.updateLine, this);
      this.line_controllers.push(new_line);
      $('ul#cart_lines', this.view).append(new_line.view);
    }
    if(this.lines.length > 0) {
      this.hideCartNotice();
    }
    this.notifyObservers(this.lines);
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
    this.update(this.lines);
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
    this.transaction = null;
    this.item = null;
    this.quantity = 0;
    this.price = 0;
  },

  valid: function() {
    return true;
  }
});
var Item = new JS.Class({
  extend: {
    find: function(id) {
      return Factory.build('Item');
    },

    search: function(query) {
      results = [];
      for(i = 0; i < 5; i++){
        results.push(Factory.build('Item'));
      }
      return results;
    }
  },

  initialize: function() {
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
      line.quantity = parseInt($('input#item_quantity', this).val());
      line.item.properties.push(credit_property);
      line.item.properties.push(cash_property);
      lines.push(line);
    });
    for(line in lines) {
      if(lines[line].valid()) {
        this.notifyObservers(lines);
      }
    }
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
      for(property in items[item].properties) {
        switch(items[item].properties[property].key) {
          case 'credit_price':
            $('td.credit_price', new_row).html(items[item].properties[property].value);
            break;
          case 'cash_price':
            $('td.cash_price', new_row).html(items[item].properties[property].value);
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
    line.item = Item.find(id);
    line.quantity = 1;
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

  showLinesSection: function() {
    this.cart_page_controller.showSection(0);
  },

  showSearchSection: function() {
    this.cart_page_controller.showSection(2);
  },

  addLines: function(lines) {
    this.showLinesSection();
    this.cart_lines_controller.update(lines);
  },

  setLines: function(lines) {
    this.notifyObservers(lines);
  }
});
var PaymentLineController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    $('input.payment', view).bind('change', {instance: this}, this.onChange);
    $('a.clear', view).bind('click', {instance: this}, this.onClear);
    this.payment = new Payment();
    this.payment.type = $('input.payment', view).attr('data-payment-type');
    this.disable();
    this.reset();
    this.callSuper();
    this.view.show();
  },

  reset: function() {
    $('input.payment', this.view).val(null);
  },

  enable: function() {
    $('input.payment', this.view).attr('disabled', false);
  },

  disable: function() {
    $('input.payment', this.view).attr('disabled', true);
  },

  hideClearButtons: function() {
    $('a.clear', this.view).hide();
  },

  showClearButtons: function() {
    $('a.clear', this.view).show();
  },

  onClear: function(event) {
    input = $(this).parents('div.payment_line').find('input.payment');
    input.val(null);
    event.data.instance.payment.amount = null;
    event.data.instance.notifyObservers(event.data.instance.payment);
    event.preventDefault();
  },

  onChange: function(event) {
    if(!isNaN($(this).val())) {
      event.data.instance.payment.amount = Currency.toPennies($(this).val());

      if(event.data.instance.payment.amount != 0) {
        $(this).val(Currency.format(event.data.instance.payment.amount));
      } else {
        $(this).val(null);
      }
      event.data.instance.notifyObservers(event.data.instance.payment);
    } else {
      $(this).val(null);
    }
  }
});
var StoreCreditController = new JS.Class(PaymentLineController, {

  initialize: function(view) {
    $('a.apply', view).hide().bind('click', {instance: this}, this.onApply);
    this.setTransaction(new Transaction());
    this.callSuper();
  },

  enable: function() {
    if(this.transaction.customer.id != null) {
      this.callSuper();
    }
  },

  onApply: function(event) {
    if(event.data.instance.transaction.customer.credit > event.data.instance.transaction.total) {
      amount = event.data.instance.transaction.total;
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
      total = event.data.instance.transaction.total;

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

  setTransaction: function(transaction) {
    this.transaction = transaction;
    if(transaction.customer.id != null) {
      $('div#payment_store_credit span#payment_customer').html(transaction.customer.person.first_name + ' ' + transaction.customer.person.last_name + ': ' + Currency.pretty(transaction.customer.credit));
      $('div#payment_store_credit a.apply').show();
      this.enable();
    }
  }

});

var ScaleController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.setTransaction(new Transaction());
    this.callSuper();
  },

  reset: function() {
    $('input.scale', this.view).val(null);
  },

  enable: function() {
    this.view.show();
  },

  disable: function() {
    this.view.hide();
  },

  setTransaction: function(transaction) {
    this.transaction = transaction;
    $('input#payment_action_credit_value', this.view).val(Currency.format(Math.abs(this.transaction.total)));
  }

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

  initialize: function() {
    this.type = 'cash';
    this.amount = 0;
  },

  valid: function() {
    return true;
  }
});

var Transaction = new JS.Class({

  initialize: function() {
    this.till = new Till();
    this.customer = new Customer();
    this.receipt = new Receipt();
    this.lines = [];
    this.payments = [];
    this.subtotal = 0;
    this.total = -1000;
    this.tax = 0;
    this.change = 0;
    this.tax_rate = 0.07;
    this.complete = false;
    this.locked = false;
  },

  save: function() {

  },

  valid: function() {
    return true;
  }
});

var PaymentController = new JS.Class(ViewController, {
  include: JS.Observable,

  initialize: function(view) {
    this.transaction = new Transaction();
    this.scale_controller = new ScaleController('div#ul_payment_scale_container');
    this.store_credit_controller = new StoreCreditController('div#payment_store_credit');
    this.gift_card_controller = new PaymentLineController('div#payment_gift_card');
    this.check_controller = new PaymentLineController('div#payment_check');
    this.credit_card_controller = new PaymentLineController('div#payment_credit_card');
    this.cash_controller = new PaymentLineController('div#payment_cash');
    this.store_credit_controller.addObserver(this.setPayment, this);
    this.gift_card_controller.addObserver(this.setPayment, this);
    this.check_controller.addObserver(this.setPayment, this);
    this.credit_card_controller.addObserver(this.setPayment, this);
    this.cash_controller.addObserver(this.setPayment, this);
    this.payments = [];
    this.reset();
    this.callSuper();
  },

  reset: function() {
    this.payments = [];
    this.resetSummary();
    this.resetPaymentFields();
    this.resetScaleFields();
    this.enableBuyFromStore();
    this.notifyObservers(this.payments);
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
  },

  resetScaleFields: function() {
    this.scale_controller.reset();
  },

  findPayment: function(type) {
    payment = null;
    for(p in this.payments) {
      if(this.payments[p].type == type) {
        payment = this.payments[p];
      }
    }
    return payment;
  },

  setPayment: function(payment) {
    existing_payment = this.findPayment(payment.type);
    if(existing_payment != null) {
      this.removePayment(existing_payment.type);
    }
    if(payment.amount != null && payment.amount != 0) {
      this.payments.push(payment);
    }
    this.notifyObservers(this.payments);
  },

  removePayment: function(type) {
    for(p in this.payments) {
      if(this.payments[p].type == type) {
        this.payments.splice(p, 1);
        return true;
      }
    }
    return false;
  },

  enablePaymentFields: function() {
    this.store_credit_controller.enable();
    this.gift_card_controller.enable();
    this.check_controller.enable();
    this.credit_card_controller.enable();
    this.cash_controller.enable();
  },

  disablePaymentFields: function() {
    this.store_credit_controller.disable();
    this.gift_card_controller.disable();
    this.check_controller.disable();
    this.credit_card_controller.disable();
    this.cash_controller.disable();
  },

  update: function(transaction) {
    this.transaction = transaction;
    this.store_credit_controller.setTransaction(transaction);
    this.scale_controller.setTransaction(transaction);
    this.updateSummary(transaction);
    if(transaction.total > 0) {
      this.enableBuyFromStore();
    } else {
      this.enableSellToStore();
    }
  },

  updateSummary: function(transaction) {
    $('div#payment_summary span#payment_summary_items', this.view).html(transaction.lines.length + ' item(s) in cart');
    $('div#payment_summary span#payment_summary_subtotal', this.view).html(Currency.pretty(transaction.subtotal));
    $('div#payment_summary span#payment_summary_tax', this.view).html('Tax: ' + Currency.pretty(transaction.tax));
    $('div#payment_summary span#payment_summary_total', this.view).html('Total: ' + Currency.pretty(transaction.total));
  },

  enableBuyFromStore: function() {
    this.enablePaymentFields();
    this.scale_controller.disable();
  },

  enableSellToStore: function() {
    this.disablePaymentFields();
    this.resetPaymentFields();
    this.payments = [];
    this.scale_controller.enable();
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
      $('td.subtotal', new_line).html(Currency.pretty(transaction.lines[line].price * transaction.lines[line].quantity));
      $('div#review_lines table tbody').append(new_line);
    }
    for(payment in transaction.payments) {
      var new_payment_row = this.payment_row.clone();
      $('td', new_payment_row).eq(0).html(String.capitalize(transaction.payments[payment].type.replace('_', ' ')));
      $('td', new_payment_row).eq(1).html(Currency.pretty(transaction.payments[payment].amount));
      $('div#review_summary table tbody tr#change').before(new_payment_row);
    }
    $('div#review_summary table > tbody > tr#subtotal > td', this.view).eq(1).html(Currency.pretty(transaction.subtotal));
    $('div#review_summary table > tbody > tr#tax > td', this.view).eq(1).html(Currency.pretty(transaction.tax));
    $('div#review_summary table > tbody > tr#total > td', this.view).eq(1).html(Currency.pretty(transaction.total));
    $('div#review_summary table > tbody > tr#change > td', this.view).eq(1).html(Currency.pretty(transaction.change));
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
    this.setItemCount(transaction.lines.length);
    this.setTotal(transaction.total);
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
      this.current_transaction.lines = lines;
      this.notifyObservers(this.current_transaction);
    }
  },

  updatePayment: function(payments) {
    if(this.current_transaction) {
      this.current_transaction.payments = payments;
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
    this.current_transaction.save();
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
  first_name: 'First',
  middle_name: 'Middle',
  last_name: 'Last',
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

  },

  valid: function() {
    return true;
  }
});
var Phone = new JS.Class({

  initialize: function() {
    this.title = null;
    this.number = null;
  },

  save: function() {

  },

  valid: function() {
    return true;
  }
});
