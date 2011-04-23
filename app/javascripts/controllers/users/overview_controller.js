//= require "../../sectionable"
//= require "../view_controller"
//= require "overview_form_controller"
//= require "overview_select_controller"
//= require "overview_user_controller"

var UsersOverviewController = new JS.Class(ViewController, {
  include: Sectionable,
  
  initialize: function(view) {
    this.callSuper();
    this.user = null;
    
    this.overview_select_controller = new OverviewSelectController('form#overview_select');
    this.overview_form_controller = new OverviewFormController('form#overview_user');
    this.overview_user_controller = new OverviewUserController('div#overview_user');
    this.overview_section_controller = new SectionController('ul#overview_nav', [
      this.overview_user_controller
    ]);
    
    $('a.new', this.view).bind('click', {instance: this}, this.newUser);
    
    this.overview_select_controller.addObserver(this.updateUser, this);
  },
  
  reset: function() {
    this.overview_form_controller.reset();
  },
  
  updateUser: function(user) {
    this.user = user;
    this.overview_form_controller.update(user);
  },
  
  newUser: function(event) {
    event.data.instance.reset();
    event.preventDefault();
  }
});