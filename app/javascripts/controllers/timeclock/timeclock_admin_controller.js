//= require "../../sectionable"
//= require "../view_controller"
//= require "../section_controller"
//= require "../date_controller"
//= require "../../models/user"
//= require "timeclock_admin_user_controller"
//= require "timeclock_admin_timecards_controller"

var TimeclockAdminController = new JS.Class(ViewController, {
  include: [JS.Observable, Sectionable],
  
  initialize: function(view) {
    this.callSuper();
    this.user = null;
    this.date = new Date();
    
    this.admin_date_controller = new DateController('form#timeclock_admin_date');
    this.admin_user_controller = new TimeclockAdminUserController('form#timeclock_admin_user');
    this.admin_timecards_controller = new TimeclockAdminTimecardsController('div#timeclock_admin_timecards');
    this.admin_section_controller = new SectionController('ul#timeclock_admin_nav', [
      this.admin_timecards_controller
    ]);
    
    this.admin_date_controller.addObserver(this.updateDate, this);
    this.admin_user_controller.addObserver(this.updateUser, this);
  },
  
  reset: function() {
    this.admin_date_controller.reset();
    this.admin_timecards_controller.reset();
  },
  
  show: function() {
    this.callSuper();
    this.updateTimecards(this.date, this.user);
  },
  
  setUsers: function(users) {
    this.admin_user_controller.setUsers(users);
  },
  
  updateDate: function(date) {
    this.date = date;
    this.updateTimecards(this.date, this.user);
  },
  
  updateUser: function(user) {
    this.user = user;
    this.updateTimecards(this.date, this.user);
  },
  
  updateTimecards: function(date, user) {
    this.admin_timecards_controller.update(date, user);
  }
});