//= require "../../sectionable"
//= require "../view_controller"
//= require "admin_timecards_timecard_controller"

var AdminTimecardsController = new JS.Class(ViewController, {
  include: Sectionable,
  
  initialize: function(view) {
    this.callSuper();
    this.date = null;
    this.user = null;
    this.timecards = [];
    this.timecard_controllers = [];
    this.timecard = $('li.timecards_line', this.view).detach();
    
    this.timecard_controller = new TimecardController('div#timecard');
    this.timecard_controller.addObserver(this.loadTimecards, this);
    
    $('a.add', this.view).bind('click', {instance: this}, this.onAdd);
  },
  
  reset: function() {
    this.date = null;
    this.user = null;
    this.timecards = [];
    this.timecard_controllers = [];
    this.clearTimecards();
  },
  
  update: function(date, user) {
    this.date = date;
    this.user = user;
    this.loadTimecards();
  },
  
  loadTimecards: function() {
    tomorrow = new Date();
    tomorrow.setDate(this.date.getDate() + 1);
    this.setTimecards(Timecard.where('user_id = ? AND begin >= ? AND begin <= ? AND end IS NOT NULL', [this.user.id, this.date.strftime('%Y-%m-%d 05:00:00'), tomorrow.strftime('%Y-%m-%d 04:59:59')]), 1, 100);
  },
  
  clearTimecards: function() {
    $('ul#timecards_lines > li').remove();
  },
  
  setTimecards: function(timecards) {
    this.clearTimecards();
    this.setTimecardsTotal(timecards);
    this.timecard_controllers = [];
    for(timecard in timecards) {
      new_timecard = new AdminTimecardsTimecardController(this.timecard.clone());
      new_timecard.set(timecards[timecard]);
      new_timecard.addObserver(this.updateTimecard, this);
      this.timecard_controllers.push(new_timecard);
      $('ul#timecards_lines', this.view).append(new_timecard.view);
    }
    if(timecards.length > 0) {
      this.hideNotice();
    } else {
      this.showNotice();
    }
  },
  
  setTimecardsTotal: function(timecards) {
    total = 0;
    for(timecard in timecards) {
      begin = (new Date()).setISO8601(timecards[timecard].begin);
      end = (new Date()).setISO8601(timecards[timecard].end);
      total += (end.valueOf() - begin.valueOf()) / 3600000
    }
    $('h3#timecards_total').html(total.toFixed(2) + ' hours');
  },
  
  updateTimecard: function(timecard) {
    if(timecard != undefined) {
      this.timecard_controller.setUser(this.user);
      this.timecard_controller.setTimecard(timecard);
      this.timecard_controller.view.show();
    } else {
      this.loadTimecards();
    }
  },
  
  onAdd: function(event) {
    event.data.instance.timecard_controller.setUser(event.data.instance.user);
    event.data.instance.timecard_controller.setTimecard(null);
    event.data.instance.timecard_controller.view.show();
    event.preventDefault();
  },
  
  showNotice: function() {
    $('h2#timecards_notice', this.view).show();
  },
  
  hideNotice: function() {
    $('h2#timecards_notice', this.view).hide();
  }
});