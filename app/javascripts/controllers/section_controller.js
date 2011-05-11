//= require "view_controller"

var SectionController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view, controllers) {
    this.callSuper();
    this._controllers = controllers;
    $('a', view).bind('click', {instance: this}, this.onClick);
  },
  
  onClick: function(event) {
    index = $('li > a', event.data.instance.view).index(this);
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
    this.hideControllers();
    this.showController(0);
  }
});