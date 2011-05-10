//= require "../../sectionable"
//= require "../view_controller"
//= require "users_overview_form_controller"
//= require "users_overview_select_controller"
//= require "users_overview_user_controller"

var UsersOverviewController = new JS.Class(ViewController, {
  include: Sectionable,
  
  initialize: function(view) {
    this.callSuper();
    this.user = null;
    
    this.overview_select_controller = new UsersOverviewSelectController('form#users_select_form');
    this.overview_form_controller = new UsersOverviewFormController('form#users_overview_user');
    this.overview_user_controller = new UsersOverviewUserController('div#users_overview_user');
    this.overview_section_controller = new SectionController('ul#users_overview_nav', [
      this.overview_user_controller
    ]);
    
    $('a.new', this.view).bind('click', {instance: this}, this.newUser);
    
    this.overview_form_controller.addObserver(this.updateUsers, this);
    this.overview_select_controller.addObserver(this.updateUser, this);
  },
  
  reset: function() {
    this.overview_form_controller.reset();
  },
  
  setUsers: function(users) {
    this.overview_select_controller.setUsers(users);
  },
  
  updateUser: function(user) {
    this.user = user;
    this.overview_form_controller.update(user);
  },
  
  newUser: function(event) {
    event.data.instance.overview_select_controller.reset();
    event.data.instance.reset();
    event.preventDefault();
  },
  
  updateUsers: function() {
    this.setUsers(User.all());
  }
});