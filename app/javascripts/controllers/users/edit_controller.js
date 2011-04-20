//= require "../../sectionable"
//= require "../view_controller"
//= require "../form_controller"
//= require "edit_person_controller"
//= require "edit_user_controller"

var EditController = new JS.Class(ViewController, {
  include: Sectionable,
  
  initialize: function(view) {
    this.callSuper();
    this.person = null;
    
    this.edit_person_controller = new EditPersonController('form#edit_person');
    this.edit_form_controller = new FormController('form#edit_user');
    this.edit_user_controller = new EditUserController('div#edit_user');
    this.edit_section_controller = new SectionController('ul#edit_nav', [
      this.edit_user_controller
    ]);
    
    $('a.new', this.view).bind('click', {instance: this}, this.newPerson);
    
    this.edit_person_controller.addObserver(this.updatePerson, this);
  },
  
  reset: function() {
    this.edit_form_controller.reset();
  },
  
  updatePerson: function(person) {
    this.person = person;
  },
  
  newPerson: function(event) {
    event.data.instance.reset();
    event.preventDefault();
  }
});