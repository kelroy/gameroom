//= require "view_controller"
//= require "cart_line_controller"

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