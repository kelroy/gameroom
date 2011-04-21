//= require "../../sectionable"
//= require "../view_controller"
//= require "edit_form_controller"
//= require "edit_select_controller"
//= require "edit_user_controller"

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