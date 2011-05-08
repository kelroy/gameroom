//= require "../../sectionable"
//= require "../view_controller"
//= require "transactions_cart_line_controller"

var TransactionsCartLinesController = new JS.Class(ViewController, {
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
        new_line = new TransactionsCartLineController(this.line.clone(), line, lines[line], true);
      } else {
        new_line = new TransactionsCartLineController(this.line.clone(), line, lines[line], false);
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